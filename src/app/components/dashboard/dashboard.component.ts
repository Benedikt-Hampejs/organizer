import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color, SingleDataSet,  monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { DAY_URL, StatisticService } from 'src/app/services/statistic-service/statistic.service';
import { Statistic } from 'src/app/models/Statistic';
import { DatePipe } from '@angular/common';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { StatisticPerCategory } from 'src/app/models/StatisticPerCategory';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  stats: Statistic = {};

  statisticChangeSubscription: Subscription;


  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  // public barChartData: ChartDataSets[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series C' },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series D' },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series E' },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series F' }
  // ];
  public barChartData: ChartDataSets[] = []
  
  // public lineChartData: ChartDataSets[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A', lineTension:0 },
  // ];category
  public lineChartData: ChartDataSets[] = [ {data:[], label: 'Finished work units per day', lineTension:0}]
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    annotation: null
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
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
    this.lineChartData[0].data = [];
    this.lineChartLabels = [];
    this.barChartLabels = [];
    this.pieChartLabels = [];
    this.pieChartData = [];
    this.pieColors[0].backgroundColor = [];
    this.statisticService.loadStatistic(DAY_URL).subscribe(res => {
      res.forEach(day => {
        this.lineChartData[0].data.push(day.sum);
        this.lineChartLabels.push(this.datePipe.transform(day.date, 'dd.MM'));
        this.barChartLabels.push(this.datePipe.transform(day.date, 'dd.MM'));
      });
      this.barChartData = [];

      this.categoryService.loadCategory().subscribe(catList => {

        catList.forEach(category => {
          const chartDataSets: ChartDataSets = { data: [], label: category.category, backgroundColor: category.color };
          this.pieChartLabels.push(category.category);
          var piCatCount = 0;
          res.forEach(day => {
            const statisticPerCategoryList: StatisticPerCategory[] = day.statisticPerCategory.filter(statPerDay => statPerDay.id == category.id);
            if (statisticPerCategoryList.length > 0) {
              chartDataSets.data.push(statisticPerCategoryList[0].count);
              piCatCount += statisticPerCategoryList[0].count;
            } else {
              chartDataSets.data.push(0);
            }
          });
          this.pieChartData.push(piCatCount);
          this.pieColors[0].backgroundColor = [...this.pieColors[0].backgroundColor, category.color];
          //(<string[]> this.pieColors[0].backgroundColor).push(category.color);
          this.barChartData.push(chartDataSets);
        });
      });
    });
  }
}
