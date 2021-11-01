
import React from 'react';

import axios from 'axios';

axios.get(`https://jsonplaceholder.typicode.com/users`)
    .then(res => {
         Tree_Data = res.data;
    })
Tree_Data = {}
export default Tree_Data;