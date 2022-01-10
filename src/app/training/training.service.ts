import {Injectable} from "@angular/core";
import {AngularFirestore} from 'angularfire2/firestore';
import { Subject } from "rxjs";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";

import {Exercise} from "./exercise.model";
import {UiService} from "../shared/ui.service";

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();

    private availableExercises: Exercise[] = [];
    // @ts-ignore
    private runningExercise: Exercise;
    private firebaseSubscription: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UiService) {
    }

    fetchAvailableExercises() {
        this.firebaseSubscription.push(this.db
            .collection('availableExercises')
            .snapshotChanges()
            .pipe(map(docArray => {
                return docArray.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        // @ts-ignore
                        name: doc.payload.doc.data()['name'],
                        // @ts-ignore
                        duree: doc.payload.doc.data()['duree'],
                        // @ts-ignore
                        calories: doc.payload.doc.data()['calories']
                    };
                });
            })).subscribe((exercises: Exercise[]) => {
                this.uiService.loadingStateChanged.next(false);
                this.availableExercises = exercises;
                this.exercisesChanged.next([...this.availableExercises]);
                // @ts-ignore
         }, error => {
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar('Echec de la recuperation de données pardon esayer plus tard', null, 3000);
                // @ts-ignore
                this.exercisesChanged.next(null);
            }));
    }

    startExercise(selectedId: string) {
        // selection et mise a jour d'un document //
        //this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
        // @ts-ignore
        this.runningExercise = this.availableExercises.find(
            ex => ex.id === selectedId
        );
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            etat: 'complet'
        });
        // @ts-ignore
        this.runningExercise = null;
        // @ts-ignore
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duree: this.runningExercise.duree * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            etat: 'annuler'
        });
        // @ts-ignore
        this.runningExercise = null;
        // @ts-ignore
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
        this.firebaseSubscription.push(this.db
            .collection('finishedExercises')
            .valueChanges()
            // @ts-ignore
            .subscribe((exercises: Exercise[]) => {
                this.finishedExercisesChanged.next(exercises);
            },(error) => {
                //console.log(error);
            }));
    }

    cancelSubscription() {
        this.firebaseSubscription.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}
