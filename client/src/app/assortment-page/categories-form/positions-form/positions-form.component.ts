import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialInstance, MaterialService } from './../../../shared/clasees/material.service';

import { Position } from './../../../shared/interfaces';
import { PositionService } from './../../../shared/services/positions.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId?: string;
  @ViewChild('modal') modalRef!: ElementRef;
  positions: Position[] = [];
  loading: boolean = false;
  positionId: string | undefined = undefined;
  modal!: MaterialInstance;
  form!: FormGroup;

  constructor(private positionService: PositionService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    });


    this.loading = true;
    if (this.categoryId) {
      this.positionService.fetch(this.categoryId).subscribe(positions => {
        this.positions = positions;
        this.loading = false;
      }, error => console.log(error.error.message))
    }
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef!);

  }

  ngOnDestroy(): void {
    this.modal.destroy!();
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open!();
    MaterialService.updateTextIputs();
  }

  onAddPosition() {
    this.form.reset({
      name: null,
      cost: 1
    });
    this.modal.open!();
    MaterialService.updateTextIputs();
  }

  onCancel() {
    this.modal.close!();
  }

  onSubmit(): void {
    this.form.disable();

    const position: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId!
    };

    const completed = () => {
      this.modal.close!();
      this.form.reset({ name: '', cost: 1 });
      this.form.enable();
    }

    if (this.positionId) {
      position._id = this.positionId;
      this.positionService.update(position).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast('Changes saved');
        },
        error => {
          this.form.enable();
          MaterialService.toast(error.error.message);
        },
        () => {
          completed();
        }
      )
    } else {
      this.positionService.create(position).subscribe(
        position => {
          MaterialService.toast('Position was created');
          this.positions.push(position);
        },
        error => {
          this.form.enable();
          MaterialService.toast(error.error.message);
        },
        () => {
          completed();
        }
      )
    }


  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Are you sure you want to delete position "${position.name}"`);

    if (decision) {
      this.positionService.delete(position).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }
}
