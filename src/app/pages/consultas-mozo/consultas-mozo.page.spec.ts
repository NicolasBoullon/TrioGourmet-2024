import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultasMozoPage } from './consultas-mozo.page';

describe('ConsultasMozoPage', () => {
  let component: ConsultasMozoPage;
  let fixture: ComponentFixture<ConsultasMozoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultasMozoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
