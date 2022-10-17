import { StatisticPerCategory } from "./StatisticPerCategory";

export interface Statistic {
    id?: number,
    date?: Date,
    sumPomodoros?: number,
    sumTasks?: number,
    statisticPerCategory?: StatisticPerCategory[]
}