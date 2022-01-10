import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import { Observable, Subscription } from "rxjs";

import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.model";
import {UiService} from "../../shared/ui.service";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // @ts-ignore
  exercises: Exercise[];
  isLoading = true;
  // @ts-ignore
  private exerciseSubscription: Subscription;
  // @ts-ignore
  private loadingSubscription: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UiService) {}

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
        isLoading => {
          this.isLoading = isLoading;
        }
    );
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
        exercises => {
          this.exercises = exercises;
        }
    );
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }
}
