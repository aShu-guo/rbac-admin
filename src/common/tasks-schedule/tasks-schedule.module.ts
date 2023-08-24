import { Module } from '@nestjs/common';
import { TasksScheduleService } from './tasks-schedule.service';

@Module({
  providers: [TasksScheduleService]
})
export class TasksScheduleModule {}
