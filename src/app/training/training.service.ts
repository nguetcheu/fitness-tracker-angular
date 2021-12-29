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

    getAvailableExercises() {
        return this.availableExercises.slice();
    }

    startExercise(selectedId: string) {
        // @ts-ignore
        this.runningExercise = this.availableExercises.find(ex => ex.id == selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }
}
