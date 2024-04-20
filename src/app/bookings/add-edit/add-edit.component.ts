import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { from } from 'rxjs';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent {
  [key: string]: any;

  addEditForm: FormGroup;
  days: number[] = [];
  hours: number[] = [];
  minutes: number[] = [];

  slotsSunday: any = [];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
  ) {
    this.addEditForm = this.fb.group({
      name: ['', Validators.required],
      durationDay: [0, Validators.required],
      durationHour: [2, Validators.required],
      durationMinute: [0, Validators.required],
      price: [null, Validators.required],
      differentStart: [false, Validators.required],
      differentStartHourValue: [
        0,
        [Validators.required, Validators.min(0), Validators.max(23)],
      ],
      differentStartMinuteValue: [
        0,
        [Validators.required, Validators.min(0), Validators.max(59)],
      ],
      multipleSlots: [false, Validators.required],
      sundaySlots: this.fb.array([]),
    });
    this.days = Array.from({ length: 31 }, (_, i) => i);
    this.hours = Array.from({ length: 24 }, (_, i) => i);
    this.minutes = Array.from({ length: 60 }, (_, i) => i);
  }

  get sundaySlots(): FormArray {
    return this.addEditForm.get('sundaySlots') as FormArray;
  }

  addSundaySlot() {
    // this.sundaySlots.length;
    // console.log(this.sundaySlots?.at(this.sundaySlots.length - 1));
    let previousSlot = this.sundaySlots?.at(this.sundaySlots.length - 1);
    if (!previousSlot || previousSlot?.valid) {
      this.sundaySlots.push(
        this.fb.group({
          startHour: [null, Validators.required],
          startMinute: [null, Validators.required],
          endHour: [null, Validators.required],
          endMinute: [null, Validators.required],
        }),
      );
      this.slotsSunday.push({
        startHour: null,
        startMinute: null,
        endHour: null,
        endMinute: null,
      });
      // console.log(this.slotsSunday);
    } else {
      this.message.error('Fill the current slot details!');
    }
  }

  getHourStartSlots(day: string, index: number): number[] {
    let previousEndHour = this['slots' + day][index - 1]?.endHour;
    const previousEndMinute = this['slots' + day][index - 1]?.endMinute;
    let currentEndHour = this['slots' + day][index]?.endHour;

    // If current slot's end hour doesn't exist then we set end hour as 24
    // Or else we increase end hour
    !currentEndHour ? (currentEndHour = 24) : currentEndHour++;

    // If there's a previous end hour signifying that there is a previous slot
    if (previousEndHour) {
      // If the time difference is there
      if (this.addEditForm.get('differentStart')?.value) {
        const differenceHour = +this.addEditForm.get('differentStartHourValue')
          ?.value;
        const differenceMinute = +this.addEditForm.get(
          'differentStartMinuteValue',
        )?.value;

        // If previous slot's end minute with time difference calculated is
        // greater than 60 we increase the previous slot's end hour by 1
        if (previousEndMinute + differenceMinute > 60) {
          previousEndHour++;
        }

        // Increasing the previous slot's end hour as per time difference
        previousEndHour += differenceHour;
      } else {
        // If no time difference is there then we check for the previous slot's
        // end minute if it is 59 then we increase the previous end hour
        previousEndMinute === 59 ? previousEndHour++ : null;
      }
    } else {
      // If there's no previous end hour, then it signifies that there's
      // no previous slot so we can take previous end hour as 0
      previousEndHour = 0;
    }

    return Array.from(
      { length: currentEndHour - previousEndHour },
      (_, i) => previousEndHour + i,
    );
  }

  getMinuteStartSlots(day: string, index: number): number[] {
    let previousEndHour = +this['slots' + day][index - 1]?.endHour;
    let previousEndMinute = +this['slots' + day][index - 1]?.endMinute;
    const currentStartHour = +this['slots' + day][index]?.startHour;
    const currentEndHour = +this['slots' + day][index]?.endHour;
    let currentEndMinute = +this['slots' + day][index]?.endMinute;

    // If current slot's end hour is not equal to start hour
    // Or current slot's end minute is not set then
    // we set current slot's end minute as 60
    currentStartHour !== currentEndHour || !currentEndMinute
      ? (currentEndMinute = 60)
      : null;

    // If previous slot exists
    if (previousEndHour) {
      // If time difference is there
      if (this.addEditForm.get('differentStart')?.value) {
        const differenceHour = +this.addEditForm.get('differentStartHourValue')
          ?.value;
        const differenceMinute = +this.addEditForm.get(
          'differentStartMinuteValue',
        )?.value;

        // If previous slot's end minute with time difference calculated is
        // greater than 60 we increase the previous slot's end hour by 1
        if (previousEndMinute + differenceMinute > 60) {
          previousEndHour++;
        }

        // Increasing the previous slot's end hour as per time difference
        previousEndHour += differenceHour;

        // If calculated previous slot's end hour is same as current slot's start
        // hour then we set previous slot's end minute accordingly
        if (previousEndHour === currentStartHour) {
          previousEndMinute = (previousEndMinute + differenceMinute) % 60;
        } else {
          // Else we set previous slot's end minute as 0
          previousEndMinute = 0;
        }
      } else {
        // If time difference is not there

        // we check if previous slot's end hour is equal to current slot's
        // start hour, then we increase previous slots's end minute by 1
        // if it is not equal then we set previous slots's end minute as 0
        previousEndHour === currentStartHour
          ? previousEndMinute++
          : (previousEndMinute = 0);
      }
    } else {
      // If previous slot doesn't exist we set previous slo's end minute as 0
      previousEndMinute = 0;
    }

    return Array.from(
      { length: currentEndMinute - previousEndMinute },
      (_, i) => previousEndMinute + i,
    );
  }

  getHourEndSlots(day: string, index: number): number[] {
    let previousEndHour = this['slots' + day][index - 1]?.endHour;
    const previousEndMinute = this['slots' + day][index - 1]?.endMinute;
    let currentStartHour = this['slots' + day][index]?.startHour;
    let nextStartHour = this['slots' + day][index + 1]?.startHour;
    const nextStartMinute = this['slots' + day][index + 1]?.startHour;

    // If current slot's start hour is not set then we take
    // previous slot's end hour as starting point
    if (!currentStartHour) {
      currentStartHour = previousEndHour ? previousEndHour : 0;
      if (previousEndMinute === 59) {
        currentStartHour++;
      }
    }

    // If the next slot's test hour is set then we take it as
    // ending point or we take 23 as ending point
    !nextStartHour ? (nextStartHour = 23) : null;

    if (nextStartHour) {
      nextStartHour++;
      // If there's time diffence set between slots
      if (this.addEditForm.get('differentStart')?.value) {
        const differenceHour = +this.addEditForm.get('differentStartHourValue')
          ?.value;
        const differenceMinute = +this.addEditForm.get(
          'differentStartMinuteValue',
        )?.value;

        // Reducing the next start hour according to next slot minute difference
        if (nextStartMinute - differenceMinute < 0) {
          nextStartHour--;
        }

        // Reducing the next start hour according to next slot with difference
        nextStartHour -= differenceHour;
      }
    }

    return Array.from(
      { length: nextStartHour - currentStartHour },
      (_, i) => currentStartHour + i,
    );
  }

  getMinuteEndSlots(day: string, index: number): number[] {
    const currentStartHour = this['slots' + day][index]?.startHour;
    let currentStartMinute = this['slots' + day][index]?.startMinute;
    const currentEndHour = this['slots' + day][index]?.endHour;
    let currentEndMinute = 60;
    let nextStartHour = this['slots' + day][index + 1]?.startHour;
    let nextStartMinute = this['slots' + day][index + 1]?.startMinute;

    // Setting start minute according to the current slot start time
    currentStartHour !== currentEndHour
      ? (currentStartMinute = 0)
      : currentStartMinute++;

    // Checking if the next time is there and
    // set ending point of current slot's end minute
    if (nextStartHour) {
      // If there is difference between slots
      if (this.addEditForm.get('differentStart')?.value) {
        const differenceHour = +this.addEditForm.get('differentStartHourValue')
          ?.value;
        const differenceMinute = +this.addEditForm.get(
          'differentStartMinuteValue',
        )?.value;

        // Reducing the next start hour according to next slot minute difference
        if (nextStartMinute - differenceMinute < 0) {
          nextStartHour--;
        }

        // Reducing the next start hour according to next slot with difference
        nextStartHour -= differenceHour;

        // If with the difference time calculated the current slot's end
        // hour is same as next slot's start hour then we calculate the
        // appropiate ending point of the current end minute
        if (nextStartHour === currentEndHour && nextStartMinute) {
          currentEndMinute =
            ((nextStartMinute - differenceMinute + 60) % 60) + 1;
          // ((20-50)+60)%60 +1 = 31
        } else {
          // If the there is still difference or start minute of next slot
          // is not present then we can take 60 as last value
          currentEndMinute = 60;
        }
      }
      // If there's no difference in time slots
      else {
        // If the start hour of next slot is same as end hour of
        // current slot and there is start minute for next slot
        if (nextStartHour === currentEndHour && nextStartMinute) {
          currentEndMinute = nextStartMinute;
        } else {
          // If the there is still difference or start minute of next slot
          // is not present then we can take 60 as last value
          currentEndMinute = 60;
        }
      }
    }

    return Array.from(
      { length: currentEndMinute - currentStartMinute },
      (_, i) => currentStartMinute + i,
    );
  }
  // protected readonly length = length;
}
