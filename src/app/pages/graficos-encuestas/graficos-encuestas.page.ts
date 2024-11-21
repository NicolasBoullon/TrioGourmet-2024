import { Component, AfterViewInit, inject } from '@angular/core';
import Chart, { ChartType } from 'chart.js/auto';
import { DatabaseService } from 'src/app/core/services/database.service';
import { HeaderComponent } from "../../shared/header/header.component";
import { IonContent} from '@ionic/angular/standalone';
import { LoadingComponent } from "../../components/loading/loading.component";

@Component({
  selector: 'app-graficos-encuestas',
  templateUrl: './graficos-encuestas.page.html',
  styleUrls: ['./graficos-encuestas.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, LoadingComponent]
})
export class GraficosEncuestasPage implements AfterViewInit {
  private databaseService = inject(DatabaseService);
  protected loading: boolean = false;
  
  constructor() { }

  ngAfterViewInit() {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.loading = true;
    this.databaseService.getDocument('encuestas').subscribe((encuestas: any[]) => {
      const calificacionGeneralCounts = this.countResponses(encuestas, 'calificacionGeneral');
      console.log(calificacionGeneralCounts)
      const calidadComidaCounts = this.countResponsesForQuality(encuestas, 'calidadComida');
      console.log(calidadComidaCounts)
      const tiempoEsperaCounts = this.countResponsesForTime(encuestas, 'tiempoEspera');
      const limpiezaCounts = this.countResponsesForLimpieza(encuestas, 'limpieza');
      
      const lineCtx = document.getElementById('lineChart') as HTMLCanvasElement;
      new Chart(lineCtx, {
        type: 'line' as ChartType,
        data: {
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          datasets: [
            {
              data: [
                calificacionGeneralCounts[1], calificacionGeneralCounts[2], calificacionGeneralCounts[3],
                calificacionGeneralCounts[4], calificacionGeneralCounts[5], calificacionGeneralCounts[6],
                calificacionGeneralCounts[7], calificacionGeneralCounts[8], calificacionGeneralCounts[9],
                calificacionGeneralCounts[10]
              ],
              label: 'Cantidad de usuarios',
              borderColor: '#FF6384',
              fill: false,
              
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              labels: {
                font: {
                  size: 20
                }
              }
            },
            tooltip: { enabled: true }
          },
          scales: {
            x: {
              ticks: {
                font: {
                  size: 18 
                }
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 18 
                }
              }
            }
          }
        }
      });

  
      const pieCtx = document.getElementById('pieChart') as HTMLCanvasElement;
      new Chart(pieCtx, {
        type: 'pie' as ChartType,
        data: {
          labels: ['Excelente', 'Buena', 'Aceptable', 'Regular', 'Mala'],
          datasets: [
            {
              data: [
                calidadComidaCounts['Excelente'],
                calidadComidaCounts['Buena'],
                calidadComidaCounts['Aceptable'],
                calidadComidaCounts['Regular'],
                calidadComidaCounts['Mala']
              ],

              backgroundColor: ['#4CAF50', '#36A2EB', '#FFCE56', '#FF6384', '#FF5733']
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { 
              position: 'top',
              labels: {
                font: {
                  size: 20 
                }
              }
            },
            title: { 
              display: true, 
              text: 'Cantidad de usuarios que votaron',
              font: {
                size: 20 
              }
            }
          }
        }
      });


    
      const barCtxTiempo = document.getElementById('barChartTiempo') as HTMLCanvasElement;
      new Chart(barCtxTiempo, {
        type: 'bar' as ChartType,
        data: {
          labels: ['Muy rápido', 'Rápido', 'Aceptable', 'Lento', 'Muy lento'],
          datasets: [
            {
              data: [
                tiempoEsperaCounts['Muy rápido'],
                tiempoEsperaCounts['Rápido'],
                tiempoEsperaCounts['Aceptable'],
                tiempoEsperaCounts['Lento'],
                tiempoEsperaCounts['Muy lento']
              ],
              label: 'Cantidad de usuarios',
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { 
              display: true,
              labels: {
                font: {
                  size: 20 
                }
              }
            },
            tooltip: { enabled: true }
          },
          scales: {
            x: {
              ticks: {
                font: {
                  size: 18
                },
                maxRotation: 90,
                minRotation: 90
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 18 
                }
              }
            }
          }
        }
      });


      const polarCtx = document.getElementById('polarChart') as HTMLCanvasElement;

      new Chart(polarCtx, {
        type: 'polarArea' as ChartType,
        data: {
          labels: ['Mesas Limpias', 'Pisos Limpios', 'Baños Limpios'],
          datasets: [
            {
              data: [
                limpiezaCounts['Mesas Limpias'],
                limpiezaCounts['Pisos Limpios'],
                limpiezaCounts['Baños Limpios']
              ],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { 
              position: 'top',
              labels: {
                font: {
                  size: 20 
                }
              }
            },
            title: { 
              display: true, 
              text: 'Cantidad de usuarios que votaron',
              font: {
                size: 20 
              }
            }
          }
        }
      });

      this.loading = false;

    });
  }

  private countResponses(encuestas: any[], field: string): Record<number, number> {
    const counts: Record<number, number> = {};

    encuestas.forEach((encuesta: any) => {
      const valueGeneralQualification = encuesta[field];
      if (valueGeneralQualification >= 1 && valueGeneralQualification <= 10) {
        counts[valueGeneralQualification] = (counts[valueGeneralQualification] || 0) + 1;
      }
    });

    for (let i = 1; i <= 10; i++) {
      if (!counts[i]) {
        counts[i] = 0;
      }
    }

    return counts;
  }

  private countResponsesForQuality(encuestas: any[], field: string): Record<string, number> {
    const counts: Record<string, number> = {
      'Excelente': 0,
      'Buena': 0,
      'Aceptable': 0,
      'Regular': 0,
      'Mala': 0
    };

    encuestas.forEach((encuesta: any) => {
      const valueFoodQuality = encuesta[field];
      if (counts[valueFoodQuality] !== undefined) {
        counts[valueFoodQuality] += 1;
      }
    });

    return counts;
  }

  private countResponsesForTime(encuestas: any[], field: string): Record<string, number> {
    const counts: Record<string, number> = {
      'Muy rápido': 0,
      'Rápido': 0,
      'Aceptable': 0,
      'Lento': 0,
      'Muy lento': 0
    };

    encuestas.forEach((encuesta: any) => {
      const valueTime = encuesta[field];
      if (counts[valueTime] !== undefined) {
        counts[valueTime] += 1;
      }
    });

    return counts;
  }

  private countResponsesForLimpieza(encuestas: any[], field: string): Record<string, number> {
    const counts: Record<string, number> = {
      'Mesas Limpias': 0,
      'Pisos Limpios': 0,
      'Baños Limpios': 0
    };

    encuestas.forEach((encuesta: any) => {
      const limpieza = encuesta[field]; 
      if (limpieza[0] === true) counts['Mesas Limpias']++;
      if (limpieza[1] === true) counts['Pisos Limpios']++;
      if (limpieza[2] === true) counts['Baños Limpios']++;
    });

    return counts;
  }
}