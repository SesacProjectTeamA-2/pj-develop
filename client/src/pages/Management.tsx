import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SummaryCard from '../components/management/SummaryCard';

import AllUser from '../components/management/AllUser';
import AllGroup from '../components/management/AllGroup';
import Report from '../components/management/Report';

export default function Management() {
    const [allUser, setAllUser] = useState();
    const [allGroup, setAllGroup] = useState();

    const getAllUser = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/users`)
            .then((res) => {
                console.log('getAllUser', res.data);

                setAllUser(res.data.allUser);
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    const getAllGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/groups`)
            .then((res) => {
                console.log('getAllGroup', res.data);
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    useEffect(() => {
        getAllUser();
        getAllGroup();
    }, []);

    console.log('allUser >>>', allUser);
    console.log('allGroup >>>', allGroup);

    return (
        <div>
            <SummaryCard allUser={allUser} />
            {/* <AllUser /> */}
            {/* <AllGroup /> */}
            {/* <Report /> */}
        </div>
    );
}
