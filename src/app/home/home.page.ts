import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks : any[] = [];

  constructor(private alertCtrl : AlertController, private toastCtrl : ToastController, private actionSheetCtrl : ActionSheetController) {
   
    let taskJson = localStorage.getItem('taskDb');

    if(taskJson != null) {
      this.tasks = JSON.parse(taskJson);
    }
  } 

  async showAdd(){
    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer?',
      inputs: [
        {
          name: 'newTask',
          type: 'text',
          placeholder: 'Estudar Ionic'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('clicked cancel')
          }
        },
        {
          text: 'Adicionar',
          handler: (form) => {
            console.log(form.newTask);
            this.add(form.newTask);
          }
        }
      ]
    });

    await alert.present();
  }

  async add(newTask : string) {

    /*Valida se usuário preencheu a task */
    if(newTask.trim().length < 1) {
      const toast = await this.toastCtrl.create({
        message: 'Informe o que deseja fazer!',
        duration: 2000,
        position: 'top'
      });

      toast.present();
      return;
    }

    let task = {name: newTask, done : false};

    this.tasks.push(task);  
    //debugger;
    this.updateLocalStore();
  }

  updateLocalStore(){
    localStorage.setItem('taskDb', JSON.stringify(this.tasks));
  }
  async openActions(task : any){

      const actionSheet = await this.actionSheetCtrl.create({
        header : "O QUE DESEJA FAZER",
        buttons : [{
          text: task.done ? 'Desmarcar' : 'Marcar',
          icon: task.done ? 'radio-button-off' : 'checkmark-circle',
          handler: () => {
            task.done = !task.done;

            this.updateLocalStore();
          }
        },{
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel cliked');
          }

        }]
      });
      await actionSheet.present();
  }

  delete(task : any){
    this.tasks = this.tasks.filter(taskArray=>task != taskArray);

    this.updateLocalStore();
  }
}
