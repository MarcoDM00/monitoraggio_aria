import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { Record } from './Record';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  sub:Subscription;
  url:string = "https://dati.comune.milano.it/datastore/dump/eda4e6bd-c037-4453-9e4d-4429e41659c1?format=json";
  records:Record[] = [];
  indice:number = 0;

  constructor(private http:HttpClient) {}

  ngOnInit() {
    this.records.push({data:"", descrizione:"", previsione:"", tendenza:""});
    this.sub = this.http.get<any>(this.url).subscribe(
      res => {
        this.records = [];
        res['records'].forEach(r => {
          let data = new Date(r[1]);
          let str = data.getDate() + "/";
          str += (data.getMonth() + 1 < 10) ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
          str += "/" + data.getFullYear();
          this.records.push({data: str, descrizione: r[2], previsione: r[3], tendenza: r[4]});
        });
        this.indice = this.records.length - 1;
      }
    );
  }

  change(type:number) {
    if (type == 0) {
      this.indice += 1;
      if (this.indice == this.records.length) this.indice = 0;
    } else {
      this.indice -= 1;
      if (this.indice == -1) this.indice = this.records.length - 1;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}