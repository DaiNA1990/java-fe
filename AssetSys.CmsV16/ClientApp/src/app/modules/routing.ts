import { Routes } from '@angular/router';
//import { AuthGuard } from './user/auth/services/auth.guard';

const Routing: Routes = [
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full',
	},
	{
		path: '**',
		redirectTo: 'error/404',
	},
	{
		path: '',
		loadChildren: () => import('./info/info-page/module').then((m) => m.InfoPageModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./info/info-form/info-form.module').then((m) => m.InfoFormModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./info/info-value/info-value.module').then((m) => m.InfoValueModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./info/info-property/info-property.module').then((m) => m.InfoPropertyModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./info/info-layout/info-layout.module').then((m) => m.InfoLayoutModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./info/info-data/info-data.module').then((m) => m.InfoDataModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./info/info-group/info-group.module').then((m) => m.InfoGroupModule),
		data: { layout: 'light-sidebar' },
		//data: { layout: 'light-sidebar', permission: 'USER_ADMIN' },
		//canActivate: [AuthGuard]
	},
	{
		path: '',
		loadChildren: () => import('./info/info-report/info-report.module').then((m) => m.InfoReportModule),
		data: { layout: 'light-sidebar' },
		//data: { layout: 'light-sidebar', permission: 'USER_ADMIN' },
		//canActivate: [AuthGuard]
	},
  {
		path: '',
		loadChildren: () => import('./job-schedule/job-schedule.module').then((m) => m.JobScheduleModule),
		data: { layout: 'light-sidebar' },
		//data: { layout: 'light-sidebar', permission: 'USER_ADMIN' },
		//canActivate: [AuthGuard]
	},
	{
		path: '',
		loadChildren: () => import('./user/user/user.module').then((m) => m.UserModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./user/user-department/user-department.module').then((m) => m.UserDepartmentModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./user/user-role-page-action-map/user-role-page-action-map.module').then((m) => m.UserRolePageActionMapModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./user/user-role-map/user-role-map.module').then((m) => m.UserRoleMapModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./user/user-role/user-role.module').then((m) => m.UserRoleModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./user/user-page-action/user-page-action.module').then((m) => m.UserPageActionModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./user/user-page/user-page.module').then((m) => m.UserPageModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./user/user-notify/user-notify.module').then((m) => m.UserNotifyModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./user/user-connection/user-connection.module').then((m) => m.UserConnectionModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./user/user-code/user-code.module').then((m) => m.UserCodeModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./user/user-activity/user-activity.module').then((m) => m.UserActivityModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./user/user-level/user-level.module').then((m) => m.UserLevelModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./user/user-title/user-title.module').then((m) => m.UserTitleModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: '',
		loadChildren: () => import('./resource/resource/resource.module').then((m) => m.ResourceModule),
		data: { layout: 'light-sidebar' },
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
	},
	{
		path: 'crafted/pages/profile',
		loadChildren: () => import('../modules/user/profile/profile.module').then((m) => m.ProfileModule),
		// data: { layout: 'light-sidebar' },
	},
	{
		path: 'crafted/account',
		loadChildren: () => import('../modules/user/account/account.module').then((m) => m.AccountModule),
		// data: { layout: 'dark-header' },
	},
];

export { Routing };
