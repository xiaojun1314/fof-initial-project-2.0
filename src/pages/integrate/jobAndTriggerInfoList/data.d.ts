
export interface JobAndTriggerInfoItem extends Record{
  startTime: string;
  endTime: string;
  triggerState: string;
  jobClassName: string;
  jobName: string;

}
export interface JobAndTriggerInfoParams {
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}
