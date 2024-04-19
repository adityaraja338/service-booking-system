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
  minHour: any = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };
  minMinute: any = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };
  // };
  protected readonly Array = Array;
  protected readonly from = from;

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
    // If it's a first slot
    if (index === 0) {
      if (this['slots' + day][index]?.endHour) {
        return Array.from(
          { length: this['slots' + day][index]?.endHour + 1 },
          (_, i) => i,
        );
      } else {
        return Array.from({ length: 24 }, (_, i) => i);
      }
    }
    // If it's a slot other than first
    else {
      let previousEndHour = this['slots' + day][index - 1]?.endHour;
      const previousEndMinute = +this['slots' + day][index - 1]?.endMinute;

      // If there's a difference between starting of slots
      if (this.addEditForm.get('differentStart')?.value) {
        const differenceHour = +this.addEditForm.get('differentStartHourValue')
          ?.value;
        const differenceMinute = +this.addEditForm.get(
          'differentStartMinuteValue',
        )?.value;
        if (previousEndMinute + differenceMinute > 60) {
          previousEndHour++;
        }
        previousEndHour += differenceHour;
      } else {
        if (previousEndMinute === 59) {
          previousEndHour++;
        }
      }

      let currentEndHour = 23;
      if (this['slots' + day][index]?.endHour) {
        // If current slot has an end hour set
        currentEndHour = this['slots' + day][index]?.endHour;
      }

      return Array.from(
        {
          length: currentEndHour - previousEndHour + 1,
        },
        (_, i) => previousEndHour + i,
      );
    }
  }

  getMinuteStartSlots(day: string, index: number): number[] {
    // If it's a first slot
    if (index === 0) {
      const currentStartHour = +this['slots' + day][index]?.startHour;
      const currentEndHour = +this['slots' + day][index]?.endHour;
      const currentEndMinute = +this['slots' + day][index]?.endMinute;
      if (currentEndHour === currentStartHour && currentEndMinute) {
        return Array.from({ length: currentEndMinute }, (_, i) => i);
      } else {
        return Array.from({ length: 60 }, (_, i) => i);
      }
    }
    // If it's a slot other than first
    else {
      let previousEndHour = +this['slots' + day][index - 1]?.endHour;
      let previousEndMinute = +this['slots' + day][index - 1]?.endMinute;
      const currentStartHour = +this['slots' + day][index]?.startHour;
      const currentEndHour = +this['slots' + day][index]?.endHour;
      let currentEndMinute = +this['slots' + day][index]?.endMinute;

      if (this.addEditForm.get('differentStart')?.value) {
        const differenceHour = +this.addEditForm.get('differentStartHourValue')
          ?.value;
        const differenceMinute = +this.addEditForm.get(
          'differentStartMinuteValue',
        )?.value;

        previousEndHour += differenceHour;

        if (differenceMinute + previousEndMinute > 60) {
          previousEndHour++;
        }
        previousEndMinute = (differenceMinute + previousEndMinute) % 60;
      }

      if (currentStartHour < currentEndHour || !currentEndHour) {
        if (currentStartHour > previousEndHour) {
          return Array.from({ length: 60 }, (_, i) => i);
        } else if (currentStartHour === previousEndHour) {
          return Array.from(
            { length: 59 - previousEndMinute },
            (_, i) => previousEndMinute + 1 + i,
          );
        }
      } else if (currentStartHour === currentEndHour) {
        currentEndMinute = currentEndMinute ? currentEndMinute : 60;
        if (currentStartHour > previousEndHour) {
          return Array.from({ length: currentEndMinute }, (_, i) => i);
        } else if (currentStartHour === previousEndHour) {
          return Array.from(
            { length: currentEndMinute - previousEndMinute - 1 },
            (_, i) => previousEndMinute + 1 + i,
          );
        }
      }
    }
    return [];
  }

  getHourEndSlots(day: string, index: number): number[] {
    let previousEndHour = this['slots' + day][index - 1]?.endHour;
    const previousEndMinute = this['slots' + day][index - 1]?.endMinute;
    let currentStartHour = this['slots' + day][index]?.startHour;
    const currentStartMinute = this['slots' + day][index]?.startMinute;
    let nextStartHour = this['slots' + day][index + 1]?.startHour;
    const nextStartMinute = this['slots' + day][index + 1]?.startHour;

    if (!currentStartHour) {
      currentStartHour = previousEndHour ? previousEndHour : 0;
      if (previousEndMinute === 59) {
        currentStartHour++;
      }
    }

    !nextStartHour ? (nextStartHour = 24) : nextStartHour++;

    if (this.addEditForm.get('differentStart')?.value) {
      const differenceHour = +this.addEditForm.get('differentStartHourValue')
        ?.value;
      const differenceMinute = +this.addEditForm.get(
        'differentStartMinuteValue',
      )?.value;
      if (nextStartMinute - differenceMinute < 0) {
        nextStartHour--;
      }
      nextStartHour -= differenceHour;
    }

    return Array.from(
      { length: nextStartHour - currentStartHour },
      (_, i) => currentStartHour + i,
    );
  }

  getMinuteEndSlots(day: string, index: number): number[] {
    const previousEndHour = this['slots' + day][index - 1]?.endHour;
    const previousEndMinute = this['slots' + day][index - 1]?.endMinute;
    const currentStartHour = this['slots' + day][index]?.startHour;
    let currentStartMinute = this['slots' + day][index]?.startMinute;
    const currentEndHour = this['slots' + day][index]?.endHour;
    let currentEndMinute = 60;
    let nextStartHour = this['slots' + day][index + 1]?.startHour;
    let nextStartMinute = this['slots' + day][index + 1]?.startMinute;

    if (currentStartHour !== currentEndHour) {
      currentStartMinute = 0;
    } else {
      currentStartMinute++;
    }
    if (nextStartHour) {
      if (this.addEditForm.get('differentStart')?.value) {
        const differenceHour = +this.addEditForm.get('differentStartHourValue')
          ?.value;
        const differenceMinute = +this.addEditForm.get(
          'differentStartMinuteValue',
        )?.value;
        if (nextStartMinute - differenceMinute < 0) {
          nextStartHour--;
        }
        nextStartHour -= differenceHour;
        if (nextStartHour === currentEndHour && nextStartMinute) {
          currentEndMinute =
            ((nextStartMinute - differenceMinute + 60) % 60) + 1;
        } else {
          currentEndMinute = 59;
        }
      } else {
        if (nextStartHour === currentEndHour && nextStartMinute) {
          currentEndMinute = nextStartMinute;
        } else {
          currentEndMinute = 59;
        }
      }
    }

    return Array.from(
      { length: currentEndMinute - currentStartMinute },
      (_, i) => currentStartMinute + i,
    );

    // if (currentEndHour > currentStartHour && !nextStartHour) {
    //   return Array.from({ length: 60 }, (_, i) => i);
    // }
    //
    // if (currentEndHour === currentStartHour && !nextStartHour) {
    //   return Array.from(
    //     { length: 59 - currentStartMinute },
    //     (_, i) => currentStartMinute + 1 + i,
    //   );
    // }
    //
    // !nextStartHour ? (nextStartHour = 24) : nextStartHour++;
    //
    // if (this.addEditForm.get('differentStart')?.value) {
    //   const differenceHour = +this.addEditForm.get('differentStartHourValue')
    //     ?.value;
    //   const differenceMinute = +this.addEditForm.get(
    //     'differentStartMinuteValue',
    //   )?.value;
    //   if (nextStartMinute && nextStartMinute - differenceMinute < 0) {
    //     nextStartHour--;
    //   }
    //   nextStartHour -= differenceHour;
    //   if (nextStartHour === currentEndHour - 1 && nextStartMinute) {
    //     currentEndMinute = (nextStartMinute - differenceMinute + 60) % 60;
    //   }
    //   console.log(`${currentEndHour} - ${nextStartHour}`);
    // }
    //
    // if (nextStartHour === currentEndHour - 2 && nextStartMinute) {
    //   currentEndMinute = nextStartMinute;
    // }
    // console.log(`${currentEndHour} - ${nextStartHour}`);
    //
    // currentEndHour > currentStartHour ? (currentStartMinute = 0) : null;
    //
    //
  }
  // protected readonly length = length;
}
