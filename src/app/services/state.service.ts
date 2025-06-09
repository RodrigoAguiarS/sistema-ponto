import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

private readonly stateChangedSubject = new Subject<void>();

  stateChanged$ = this.stateChangedSubject.asObservable();

  notifyStateChanged() {
    this.stateChangedSubject.next();
  }
}

