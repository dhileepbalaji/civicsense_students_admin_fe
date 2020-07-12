import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'
import CloseIcon from '@material-ui/icons/Close'
import UserModifierPaneContainer from '../UserModifierPaneContainer';
import Table from './Table';
import Fab from './CustomFab';
import './index.css';
import {deleteVolunteer} from "../../actions/userManagementActions";
import {editVolunteer} from "../../actions/userModifierPaneActions";

const columns = [
    {
        id: 'name',
        label: 'Name',
        align: 'left',
    },
    {
        id: 'number',
        label: 'Number',
        align: 'left',
    },
    {
        id: 'isolationType',
        label: 'Isolation Type',
        align: 'left',
    },
    {
        id: 'daysRemaining',
        label: 'Days Remaining',
        align: 'left',
    },
];

const convertDataToRowsForTable = (records, selectedRecords) => records.map((record) => {
    const {
        name, number, isolationType, daysRemaining,
    } = record;
    const selectedRecord = selectedRecords.find((r) => r.number === number);
    return {
        id: number,
        name,
        number,
        isolationType,
        daysRemaining,
        checked: !!selectedRecord,
    };
});

class UserManagement extends PureComponent{
    constructor() {
        super();
        this.state = {
            searchText: '',
            dropdownView: false,
            transferSearchText: '',
            tableOrderBy: 'name',
            selectedPatients: [],
            columnChecked: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleTransferPatients = this.handleTransferPatients.bind(this);
        this.handleRowCheckboxClick = this.handleRowCheckboxClick.bind(this);
        this.handleTableOrderByChange = this.handleTableOrderByChange.bind(this);
        this.handleColumnCheckboxClick = this.handleColumnCheckboxClick.bind(this);
        this.handleFabClick = this.handleFabClick.bind(this);

        this.renderSearchComponent = this.renderSearchComponent.bind(this);
        this.renderVolunteerComponent = this.renderVolunteerComponent.bind(this);
        this.renderTransferComponent = this.renderTransferComponent.bind(this);
        this.renderPatientsComponent = this.renderPatientsComponent.bind(this);
        this.renderUserModifierPane = this.renderUserModifierPane.bind(this);
    }

    handleChange = (field) => (event) => {
        this.setState({ [field]: event.target.value })
    }

    handleSearch = () => {
        const { searchText } = this.state;
        const { searchVolunteerByNumber } = this.props;
        searchVolunteerByNumber(searchText);
    }

    handleEdit = () => {
        const { volunteer, editVolunteer } = this.props;
        editVolunteer(volunteer);
        this.handleFabClick();
    }

    handleDelete = () => {
        const { deleteVolunteer, volunteer } = this.props;
        deleteVolunteer(volunteer.id);
    }

    handleDropdown = () => {
        const { dropdownView } = this.state;
        this.setState({ dropdownView: !dropdownView });
    }

    handleTransferPatients = () => {
        this.handleDropdown();
    }

    handleRowCheckboxClick = (row) => {
        const record = {
            id: row.id,
            name: row.name,
            number: row.number,
            isolationType: row.isolationType,
            daysRemaining: row.daysRemaining,
        };
        const { selectedPatients } = this.state;
        const newSelectedPatients = Object.assign([], selectedPatients);
        const alreadySelectedPatient = newSelectedPatients.find(patient => patient.id === row.id);

        if (!alreadySelectedPatient) {
            newSelectedPatients.push(record);
            this.setState({ selectedPatients: newSelectedPatients });
        }
        else {
            this.setState({
                selectedPatients: newSelectedPatients.filter(patient => patient.id !== row.id)
            });
        }
    }

    handleTableOrderByChange = (tableOrderBy) => {
        this.setState({ tableOrderBy });
    }

    handleColumnCheckboxClick = (event) => {
        const { patients } = this.props;
        const columnChecked = event.target.checked;
        if (columnChecked) {
            this.setState({ selectedPatients: patients });
        } else {
            this.setState({ selectedPatients: [] });
        }

        this.setState({ columnChecked });
    }

    handleFabClick = () => {
        const { toggleUserModifierPane } = this.props;
        toggleUserModifierPane(true);
    }

    renderSearchComponent = () => {
        const { searchText } = this.state;
        return (
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Enter volunteer phone number here"
                    value={searchText}
                    onChange={this.handleChange('searchText')}
                />
                <button
                    type="button"
                    onClick={this.handleSearch}
                >
                    Search
                </button>
            </div>
        );
    }

    renderVolunteerComponent = () => {
        const { volunteer, fetchingVolunteer, fetchedVolunteer } = this.props;
        return (
            <div className="volunteer-information">
                <div className="header">
                    <span>Volunteer Information</span>
                </div>
                <div className="content">
                    {(fetchingVolunteer && !fetchedVolunteer) && (
                        <div className="loader"><CircularProgress color="secondary" /></div>
                    )}
                    {/*{(!fetchingVolunteer && fetchedVolunteer) && (*/}
                        <>
                            <div className="data">
                                <span className="key">Name</span>
                                <span className="value">{volunteer.name || ''}</span>
                            </div>
                            <div className="data">
                                <span className="key">Phone Number</span>
                                <span className="value">{volunteer.number || ''}</span>
                            </div>
                            <div className="data">
                                <span className="key">Zone</span>
                                <span className="value">{volunteer.zone || ''}</span>
                            </div>
                            <div className="data">
                                <span className="key">Ward</span>
                                <span className="value">{volunteer.ward || ''}</span>
                            </div>
                            <div className="actions">
                                <button
                                    type="button"
                                    onClick={this.handleEdit}
                                >
                                    <EditIcon />
                                    <span>Edit</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={this.handleDelete}
                                >
                                    <DeleteIcon />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </>
                    {/*)}*/}
                </div>
            </div>
        );
    }

    renderTransferComponent = () => {
        const { dropdownView, transferSearchText } = this.state;
        const { transferVolunteer, fetchingTransferVolunteer, fetchedTransferVolunteer } = this.props;
        if (!dropdownView) return <></>;
        else return (
            <div className="transfer-component">
                <div className="header">
                    <span>Select Voluneer</span>
                    <button
                        type="button"
                        onClick={this.handleDropdown}
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className="transfer-component-search">
                    <input
                        type="text"
                        placeholder="Search by phone number"
                        value={transferSearchText}
                        onChange={this.handleChange('transferSearchText')}
                    />
                </div>
                <div className="transfer-component-content">
                    {(fetchingTransferVolunteer && !fetchedTransferVolunteer) && (
                        <div className="loader"><CircularProgress color="secondary" /></div>
                    )}
                    {/*{(!fetchingTransferVolunteer && fetchedTransferVolunteer) && (*/}
                        <>
                            <div>
                                <span>{transferVolunteer.name || ''}</span>
                                <span>{transferVolunteer.zone || ''}</span>
                            </div>
                            <div>
                                <span>{transferVolunteer.number || ''}</span>
                                <span>{transferVolunteer.ward || ''}</span>
                            </div>
                        </>
                    {/*)}*/}
                </div>
                <button
                    type="button"
                    onClick={this.handleTransferPatients}
                >
                    Transfer Patients
                </button>
            </div>
        );
    }

    renderPatientsComponent = () => {
        const { tableOrderBy, columnChecked, selectedPatients } = this.state;
        const { patients, fetchingPatients, fetchedPatients } = this.props;
        const rows = convertDataToRowsForTable(patients, selectedPatients);
        return (
            <div className="patient-list">
                <div className="header">
                    <span>Patient List</span>
                    <div className="transfer-to">
                        <button
                            type="button"
                            onClick={this.handleDropdown}
                        >
                            Transfer to
                        </button>
                        {this.renderTransferComponent()}
                    </div>
                </div>
                <div className="content">
                    {(fetchingPatients && !fetchedPatients) && (
                        <div className="loader"><CircularProgress color="secondary" /></div>
                    )}
                    {/*{(!fetchingPatients && fetchedPatients) && (*/}
                        <Table
                            columns={columns}
                            rows={rows}
                            columnChecked={columnChecked}
                            onColumnCheckboxClick={this.handleColumnCheckboxClick}
                            onRowCheckboxClick={this.handleRowCheckboxClick}
                            orderBy={tableOrderBy}
                            setOrderBy={this.handleTableOrderByChange}
                            preventSortForColumns={[]}
                        />
                    {/*)}*/}
                </div>
            </div>
        );
    }

    renderUserModifierPane = () => {
        const { showUserModifierPane } = this.props;
        if (showUserModifierPane) {
            return (
                <UserModifierPaneContainer />
            );
        }
        return (<></>);
    }

    render() {
        return (
            <div className="user-management">
                <div className="user-management-content">
                    <div className="user-management-content-header">
                        <span>User Management</span>
                    </div>
                    <div className="user-management-content-tab-content">
                        <div className="tabs">
                            <button className="tab">
                                HQIMS
                            </button>
                        </div>
                        <div className="content">
                            {this.renderSearchComponent()}
                            {this.renderVolunteerComponent()}
                            {this.renderPatientsComponent()}
                        </div>
                    </div>
                </div>
                <div className="floating-button">
                    <Fab onClick={() => this.handleFabClick()} />
                </div>
                {this.renderUserModifierPane()}
            </div>
        );
    }
}

export default UserManagement;

UserManagement.propTypes = {
    searchVolunteerByNumber: PropTypes.func.isRequired,
    editVolunteer: PropTypes.func.isRequired,
    deleteVolunteer: PropTypes.func.isRequired,
    fetchTransferVolunteer: PropTypes.func.isRequired,
    volunteer: PropTypes.object.isRequired,
    fetchingVolunteer: PropTypes.bool.isRequired,
    fetchedVolunteer: PropTypes.bool.isRequired,
    errorFetchingVolunteer: PropTypes.string.isRequired,
    transferVolunteer: PropTypes.object.isRequired,
    fetchingTransferVolunteer: PropTypes.bool.isRequired,
    fetchedTransferVolunteer: PropTypes.bool.isRequired,
    errorFetchingTransferVolunteer: PropTypes.string.isRequired,
    patients: PropTypes.array.isRequired,
    fetchingPatients: PropTypes.bool.isRequired,
    fetchedPatients: PropTypes.bool.isRequired,
    errorFetchingPatients: PropTypes.string.isRequired,
    showUserModifierPane: PropTypes.bool.isRequired,
    toggleUserModifierPane: PropTypes.bool.isRequired,
};
