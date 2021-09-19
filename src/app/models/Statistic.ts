import { StatisticPerCategory } from "./StatisticPerCategory";

export interface Statistic {
    id?: number,
    sum?: number,
    statisticPerCategory?: StatisticPerCategory[]
}