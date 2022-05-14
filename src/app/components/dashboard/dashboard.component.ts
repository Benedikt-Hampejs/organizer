import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color, SingleDataSet,  monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { DAY_URL, StatisticService } from 'src/app/services/statistic-service/statistic.service';
import { Statistic } from 'src/app/models/Statistic';
import { DatePipe } from '@angular/common';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { StatisticPerCategory } from 'src/app/models/StatisticPerCategory';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/Category';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  stats: Statistic = {};

  statisticChangeSubscription: Subscription;

  // gerneral information
  categories: Category[] = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true
          }
      }]
  }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = []
 
  //public lineChartData: ChartDataSets[] = [ {data:[], label: 'Pomodoros', lineTension:0}]

  lineChartData: ChartDataSets[] = [
     {}
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    annotation: null
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'transparent',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieColors: Color[] = [
    {
      backgroundColor: [
      ]
    }
  ];

  public pieChartLabels: Label[];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private statisticService: StatisticService, private categoryService: CategoryService, private datePipe: DatePipe) { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  ngOnDestroy(): void {
    this.statisticChangeSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.fillStaticVariables();
    this.statisticChangeSubscription = this.statisticService.statisticChanged$.subscribe(_ => {
      this.fillStaticVariables()
    });
  }

  private fillStaticVariables() {
    // this.lineChartData[0].data = [];
    this.lineChartLabels = [];
    this.barChartLabels = [];
    this.pieChartLabels = [];
    this.pieChartData = [];
    this.pieColors[0].backgroundColor = [];

    this.categoryService.loadCategory().subscribe(res => {
      this.lineChartData = [] // pop undefined label category
      this.categories = []
      res.forEach(category => {
        this.lineChartData.push({ data: [], label: category.category, backgroundColor: 'transparent', borderColor: category.color })
        this.categories.push(category)
      })
    })

    this.statisticService.loadStatistic(DAY_URL).subscribe(res => {
      res.forEach(day => {
        this.lineChartData.forEach(catCharData => {
          var catId = this.categories.find(cat => cat.category == catCharData.label).id
          var count = 0
          if (day.statisticPerCategory.find(statPerCat => statPerCat.id == catId) != undefined)
            count = day.statisticPerCategory.find(statPerCat => statPerCat.id == catId).count
          catCharData.data.push(count)
        })

        // day.statisticPerCategory.forEach(catStats => {
        //   catStats.count
        //   //this.lineChartData.find((d) => d.)
        // })
        //   this.lineChartData[0].data.push(day.sum);
        //   this.lineChartData[1].data.push(day.sum/2);
        //   this.lineChartData[2].data.push(day.sum*2);
          this.lineChartLabels.push(this.datePipe.transform(day.date, 'dd.MM'));
          this.barChartLabels.push(this.datePipe.transform(day.date, 'dd.MM'));
      });
    });
    // this.statisticService.loadStatistic(DAY_URL).subscribe(res => {
    //    res.forEach(day => {
    //        this.lineChartData[0].data.push(day.sum);
    //        this.lineChartData[1].data.push(day.sum/2);
    //        this.lineChartData[2].data.push(day.sum*2);
    //        this.lineChartLabels.push(this.datePipe.transform(day.date, 'dd.MM'));
    //        this.barChartLabels.push(this.datePipe.transform(day.date, 'dd.MM'));
    //    });
    //   this.barChartData = [];

    //   this.categoryService.loadCategory().subscribe(catList => {

    //     catList.forEach(category => {
    //       const chartDataSets: ChartDataSets = { data: [], label: category.category, backgroundColor: category.color };
    //       this.pieChartLabels.push(category.category);
    //       var piCatCount = 0;
    //       res.forEach(day => {
    //         const statisticPerCategoryList: StatisticPerCategory[] = day.statisticPerCategory.filter(statPerDay => statPerDay.id == category.id);
    //         if (statisticPerCategoryList.length > 0) {
    //           chartDataSets.data.push(statisticPerCategoryList[0].count);
    //           piCatCount += statisticPerCategoryList[0].count;
    //         } else {
    //           chartDataSets.data.push(0);
    //         }
    //       });
    //       this.pieChartData.push(piCatCount);
    //       this.pieColors[0].backgroundColor = [...this.pieColors[0].backgroundColor, category.color];
    //       //(<string[]> this.pieColors[0].backgroundColor).push(category.color);
    //       this.barChartData.push(chartDataSets);
    //     });
    //   });
    // });
  }
}
