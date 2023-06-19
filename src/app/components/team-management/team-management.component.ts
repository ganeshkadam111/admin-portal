import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialogComponent } from 'src/app/dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss']
})
export class TeamManagementComponent {

  title = 'admin-portal';
  faTrash = faTrash;
  faPencil = faPencil;
  shownoteam = false;
  end = 'end';
  isEdit = false;
  needtoUpdate: any;
  submitted = false;
  disableSelect =false;
  
  teamLeadList: any[] = [
    { id: 1, name: 'Rohit sharma' },
    { id: 2, name: 'Rahul Dravid' },
    { id: 3, name: 'Virat Kohali' },
    { id: 4, name: 'Hardik Pandya' },
    { id: 5, name: 'MS dhoni' }
  ];

  noLeadMemberList: any[] = [
    { id: 1, name: 'TeamMember 51', isDisable: false },
    { id: 2, name: 'TeamMember 52', isDisable: false },
    { id: 3, name: 'TeamMember 53', isDisable: false },
    { id: 4, name: 'TeamMember 54', isDisable: false },
  ];

  selectedTeamLeadList: any = [];
  selectedTeamNameList: any = [];
  teamList: any = [
    {
      teamLead: {},
      teamName: '',
      teamMember: this.noLeadMemberList
    }
  ];
  addForm = this.fb.group({
    teamLead: ['', Validators.required],
    teamName: ['', Validators.required],
    teamMember: new UntypedFormControl('')
  });

  constructor(private fb: FormBuilder, private dialog: MatDialog) { }

  get f() { return this.addForm.controls; }

  public trackItem(index: number, item: any) {
    return item.trackId;
  }

  check(val: any) {
    val.isDisable = !val.isDisable
  }

  addFormSubmit(value: any) {
    this.submitted = true;
    let serializedForm;

    if (!this.addForm.valid) {
      this.addForm.markAllAsTouched();
    }

    if (this.addForm.invalid) {
      return;
    }
    this.shownoteam = true;
    serializedForm = { ...this.addForm.value, teamMember: [] };
    if (!this.isEdit) {
      this.teamList.push(serializedForm)
      this.removeTeamLead(value.teamLead.id);

    } else {
      const index = this.teamList.findIndex((obj: any) => {
        return obj.teamLead.id === this.needtoUpdate[0].teamLead.id;
      });

      this.teamList[index].teamLead = this.needtoUpdate[0].teamLead;
      this.teamList[index].teamName = this.addForm.value.teamName;
      this.removeTeamLead(value.teamLead.id);
      this.isEdit = false;
    }

    this.addForm.reset();

    this.addForm.markAllAsTouched();
    (Object as any).values(this.addForm.controls).forEach((control: FormControl) => {
      control.setErrors(null);
    });

  }

  editTeamLead(teamValue: any, teamName: string) {
    this.needtoUpdate = this.teamList.filter((item: any) => item.teamLead.id == teamValue.id);
    this.teamLeadList.push(this.needtoUpdate[0].teamLead);

    this.addForm.patchValue({
      teamLead: teamValue,
      teamName: teamName
    });

    this.isEdit = true;
  }

  deleteTeam(leadName: any) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure, you want to delet Team Lead'
      }
    });
    confirmDialog.afterClosed().subscribe((result: any) => {
      if (result === true) {
        let needtoremove = this.teamList.filter((item: any) => item.teamLead.id == leadName.id);
        this.teamList = this.teamList.filter((item: any) => item.teamLead.id != leadName.id);
        this.teamList[0].teamMember.push(...needtoremove[0].teamMember)
        this.teamLeadList.push(needtoremove[0].teamLead)
      }
    });
  }

  removeTeamLead(id: string): void {


    this.teamLeadList = this.teamLeadList.filter(item => item.id != id);
  }

  drop(event: CdkDragDrop<{ id: any; Name: string }[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
