import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import { Subscription } from "rxjs";

import {AuthService} from "../auth.service";
import {UiService} from "../../shared/ui.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  // @ts-ignore
  maxDate;
  isLoading = false;
  // @ts-ignore
  private LoadingSubs : Subscription
  constructor(private authService: AuthService, private uiService: UiService) { }

  ngOnInit() {
    this.LoadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
    this.maxDate= new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser(
        {
          email: form.value.email,
          password: form.value.password
        }
    );
  }

  ngOnDestroy() {
    this.LoadingSubs.unsubscribe();
  }
}
