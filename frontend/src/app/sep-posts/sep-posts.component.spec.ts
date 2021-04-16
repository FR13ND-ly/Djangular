import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SepPostsComponent } from './sep-posts.component';

describe('SepPostsComponent', () => {
  let component: SepPostsComponent;
  let fixture: ComponentFixture<SepPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SepPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SepPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
