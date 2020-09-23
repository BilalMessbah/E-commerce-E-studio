import React, { useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getBasket , getLogin } from "./actions/getAction";
import { removeOneBasket , logout} from "./actions/deleteAction";
import Rating from '@material-ui/lab/Rating';
import jsPDF from 'jspdf';
import logo from '../logo.png';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import { connect , useSelector , useDispatch} from 'react-redux';

   
    
    //                 {this.state.data.map((studio) => {
    //                     console.log(studio);
    //                     {moment() > moment(studio.day) ? 



class Studiores extends Component {

    constructor(props){
        super(props);
        this.state = {
            rows : [],
            page : 0,
            rowsPerPage : 10,
            
        }
    }

    componentDidMount(){
        getLogin();
        this.get_apointment();
    }

    get_apointment = () => {
        axios.get(`http://localhost:8080/studio/reservation/${this.props.match.params.id}`, {headers: { "token": this.props.loginProps.token }}).then(response => {
            console.log(response.data);
            let res = response.data;
            let test = [];
            res.map((e) => {
                console.log(e);
                if(moment() <= moment(e.day)){
                    let services = e.services === "null" ? "Aucun" : e.services;
                    console.log(services);
                    let res = createData(moment(e.day).format("DD/MM/YYYY"), e.start.substr(0,5), e.finish.substr(0,5), services ,`${e.user_name} ${e.user_firstname}`);
                    test.push(res);
                }
            })
            this.setState({ rows : test});
            // var rows = test;
        })
    }

    

    handleChangePage = (event, newPage) => {
        this.setState({ page : newPage})
    };
  
    handleChangeRowsPerPage = (event) => {
        this.setState({ page : 0, rowsPerPage : +event.target.value})
    };
    
    render(){
        return (
            <Paper style={{width: '100%'}}>
              <TableContainer style={{maxHeight: 440,}}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { this.state.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number' ? column.format(value) : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={this.state.rows.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          );
    }
}


const columns = [
    { id: 'name', label: 'Date', minWidth: 170 },
    { id: 'code', label: 'Debut', minWidth: 100 },
    {
      id: 'population',
      label: 'Fin',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'size',
      label: 'Service',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'density',
      label: 'Nom',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toFixed(2),
    },
  ];
  
  function createData(name, code, population, size,nom) {
    const density = nom;
    return { name, code, population, size, density };
  }
  
  
  
  

//   const useStyles = makeStyles({
//     root: {
//       width: '100%',
//     },
//     container: {
//       maxHeight: 440,
//     },
//   });
// const classes = useStyles();


const mapStateToProps = state => ({
    basketProps : state.basketState,
    loginProps : state.auth,
})

export default connect(mapStateToProps, { getBasket, removeOneBasket , getLogin , logout})(Studiores);