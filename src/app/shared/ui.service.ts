import { Subject } from "rxjs";
import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class UiService {
    loadingStateChanged = new Subject<boolean>();

    constructor(private snackbar: MatSnackBar) {
    }

    // @ts-ignore
    showSnackbar(message, action, duration) {
        this.snackbar.open(message,action, {
            duration: duration
        })
    }
}
