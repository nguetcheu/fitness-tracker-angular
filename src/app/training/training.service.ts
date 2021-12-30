import { Subject } from "rxjs";
import {Exercise} from "./exercise.model";

export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    private availableExercises: Exercise[] = [
        { id: 'pompes', name: 'Pompes', duree: 30, calories: 8 },
        { id: 'Gainage', name: 'Gainage', duree: 180, calories: 120 },
        { id: 'jumping-jack', name: 'Jumping Jack', duree: 300, calories: 8 },
        { id: 'squats', name: 'Squats', duree: 60, calories: 59 },
    ];
    // @ts-ignore
    private runningExercise: Exercise;
    private exercises: Exercise[] = [];

    getAvailableExercises() {
        return this.availableExercises.slice();
    }

    startExercise(selectedId: string) {
        // @ts-ignore
        this.runningExercise = this.availableExercises.find(ex => ex.id == selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.exercises.push({
            ...this.runningExercise,
            date: new Date(),
            etat: "complet"
        });
        // @ts-ignore
        this.runningExercise = null;
        // @ts-ignore
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.exercises.push({
            ...this.runningExercise,
            duree: this.runningExercise.duree * (progress/ 100),
            calories: this.runningExercise.calories * (progress/ 100),
            date: new Date(),
            etat: "annuler"
        });
        // @ts-ignore
        this.runningExercise = null;
        // @ts-ignore
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    getCompletedOrCancelledExercises() {
        return this.exercises.slice();
    }
}
