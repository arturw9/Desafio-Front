// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopBar } from '../../shared/top-bar/top-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBar],
  templateUrl: './app-component.html',
  styleUrls: ['./app-component.scss']
})
export class AppComponent {}
