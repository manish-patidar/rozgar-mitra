import type { FC } from 'react';
import CustomerHome from './CustomerHome';
import LaborHome from './LaborHome';
import { getUserRole } from '../../utils/auth';
import { ROLES } from '../../utils/constants';

const Home: FC = () => {
    const role = getUserRole();

    return role === ROLES.LABOUR ? <LaborHome /> : <CustomerHome />;
};

export default Home;
