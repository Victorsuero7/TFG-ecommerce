import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userId?: number;
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }
}