import { StatisticPerCategory } from "./StatisticPerCategory";

export interface Statistic {
    id?: number,
    date?: Date,
    sum?: number,
    statisticPerCategory?: StatisticPerCategory[]
}