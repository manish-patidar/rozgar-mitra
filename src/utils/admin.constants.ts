import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import type { AdminMenuItem } from '../pages/Admin/admin.types';
import { LABOUR_THEME } from './labour.constants';

export const ADMIN_SIDEBAR_WIDTH = 260;

export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
    { text: 'Overview', path: '/admin', icon: DashboardIcon },
    { text: 'Customers', path: '/admin/customers', icon: PeopleIcon },
    { text: 'Labours', path: '/admin/labours', icon: EngineeringIcon },
    { text: 'Services', path: '/admin/services', icon: BuildIcon },
    { text: 'Service Assignments', path: '/admin/tasks', icon: AssignmentTurnedInIcon },
];

export const THEME_COLORS = {
    primary: LABOUR_THEME.primary,
    background: LABOUR_THEME.background,
    white: LABOUR_THEME.surface,
    text: LABOUR_THEME.text,
    textSecondary: LABOUR_THEME.textSecondary,
    success: LABOUR_THEME.primary,
    warning: LABOUR_THEME.warning,
    purple: '#7c3aed'
};