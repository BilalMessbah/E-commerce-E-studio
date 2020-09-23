import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import index from './index';
import Header from "./header";
import Draw from "./appBar";
import updateUser from "./updateUser";
import DeleteUser from "./deleteUser";
import UpdateStudio from "./updateStudio";
import DeleteStudio from "./deleteStudio";
import ReactUser from "./reactUser";
import Code from "./code_promo";
import Get_Code from "./getCpromo";

const admin = () => <div>admin</div>;
const users = () => <div>users</div>;
const home = () => <div>home</div>;
const studio = () => <div>studio</div>;

const AdminRouter = ({match}) => {
    console.log('admin router');
    return (
        <div className="App" style={{backgroundColor: '#02C39A'}}>
            <Header/>
            <Draw/>
        <Route path={match.path} exact component={admin}/>
        <Route path={match.path+"/User_edit"} exact component={updateUser}/>
        <Route path={match.path+"/Studio_edit"} exact component={UpdateStudio}/>
        <Route path={match.path+"/User_deactivate"} exact component={DeleteUser}/>
        <Route path={match.path+"/Studio_delete"} exact component={DeleteStudio}/>
        <Route path={match.path+"/User_reactivate"} exact component={ReactUser}/>
        <Route path={match.path+"/Code_promo"} exact component={Code}/>
        <Route path={match.path+"/Get_code"} exact component={Get_Code}/>
        </div>
    )
}
export default AdminRouter;