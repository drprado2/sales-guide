import React, {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Helmet } from 'react-helmet';
import {
  ListItemIcon, ListItemText, Menu, MenuItem, Zoom,
} from '@material-ui/core';
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { generatePath } from 'react-router';
import { useHistory } from 'react-router-dom';
import { allRoutes } from '../../../store/modules/auth/slice';
import { resetBreadcrumbTo, setCurrentPage } from '../../../store/modules/template/slice';
import { getList, setPaginateFilter, deleteRequest } from '../../../store/modules/employeeTypes/slice';
import { StoreState } from '../../../store';
import EmptyTable from '../../../components/EmptyTable';

const EmployeeTypesPage = () => {
  const dispatch = useDispatch();
  const {
    paginated, loadingGetList, paginateFilter, loadingDelete,
  } = useSelector((state: StoreState) => state.employeeTypes);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const dataTableRef = useRef<DataTable>(null);
  const [menuRef, setMenuRef] = React.useState<any>(null);
  const toast = useRef<Toast>(null);
  const history = useHistory();

  const currentRoute = allRoutes.find((r) => r.id === 'employeeType-list');
  const viewRoute = allRoutes.find((r) => r.id === 'view-employeeType');
  const editRoute = allRoutes.find((r) => r.id === 'edit-employeeType');
  const createRoute = allRoutes.find((r) => r.id === 'create-employeeType');

  useEffect(() => {
    dispatch(getList());
  }, []);

  useEffect(() => {
    if (currentRoute) {
      dispatch(setCurrentPage({
        icon: currentRoute.icon,
        routeId: currentRoute.id,
        title: currentRoute.title,
        pageImage: currentRoute.pageImage,
      }));
      dispatch(resetBreadcrumbTo({
        path: currentRoute.path,
        routeId: currentRoute.id,
        title: currentRoute.title,
      }));
    }
  }, [currentRoute]);

  const handleClose = () => {
    setMenuRef(null);
  };

  const renderHeader = () => (
    <div className="table-header">
      <Button
        label="Exportar CSV"
        className="p-button-success"
        type="button"
        icon="pi pi-file-excel"
        onClick={() => dataTableRef?.current?.exportCSV()}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e: ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)} placeholder="Pesquisar em tudo" />
      </span>
    </div>
  );

  const onDeleteSuccess = () => {
    toast.current?.show({
      severity: 'success', summary: 'Deletado!', detail: 'Registro removido com sucesso!', life: 3000,
    });
  };

  const confirmDelete = (id: string) => {
    setMenuRef(null);
    confirmDialog({
      message: 'Deseja realmente deletar esse registro?',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      // @ts-ignore
      header: 'Confirmar deleção',
      accept: () => dispatch(deleteRequest({ id, callBack: onDeleteSuccess })),
    });
  };

  const onEdit = (id: string) => {
    setMenuRef(null);
    history.push(generatePath(editRoute?.path ?? '/', { id }));
  };

  const onCreate = () => {
    setMenuRef(null);
    history.push(createRoute?.path ?? '/');
  };

  const onView = (id: string) => {
    setMenuRef(null);
    history.push(generatePath(viewRoute?.path ?? '/', { id }));
  };

  const actionBodyTemplate = (rowData: any) => (
    <div>
      <Button type="button" icon="pi pi-cog" className="p-button-secondary" onClick={(ev) => setMenuRef(ev.target)} />
      <Menu
        id="customized-menu"
        anchorEl={menuRef}
        keepMounted={false}
        open={Boolean(menuRef)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => onView(rowData.id)}>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText primary="Visualizar" />
        </MenuItem>
        <MenuItem onClick={() => onEdit(rowData.id)}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Editar" />
        </MenuItem>
        <MenuItem onClick={() => confirmDelete(rowData.id)}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Deletar" />
        </MenuItem>
      </Menu>
    </div>
  );

  const header = renderHeader();

  return (
    <div id="employeeTypes-page">
      <Toast ref={toast} />
      <Tooltip title="Criar novo!" aria-label="add">
        <Fab className="add-btn" color="primary" aria-label="add" onClick={onCreate}>
          <AddIcon />
        </Fab>
      </Tooltip>
      <Helmet>
        <title>{currentRoute?.title}</title>
        <meta name="description" content="lista de tipo de contratações" />
      </Helmet>
      <Zoom in>
        <Card>
          {(loadingGetList || loadingDelete) && (
            <>
              <Skeleton className="p-skeleton-loader" />
              <ProgressSpinner className="loader-app" />
            </>
          )}
          <DataTable
            ref={dataTableRef}
            header={header}
            globalFilter={globalFilter}
            value={paginated.data}
            dataKey="id"
            rowHover
            emptyMessage={<EmptyTable />}
            sortMode="multiple"
            removableSort
            exportFilename="regioes"
          >
            <Column field="name" header="Nome" sortable filter filterMatchMode="contains" filterPlaceholder="Pesquisar por nome" />
            <Column field="description" header="Descrição" sortable filter filterMatchMode="contains" filterPlaceholder="Pesquisar por descrição" />
            <Column field="createdAt" header="Data Criação" sortable filter filterMatchMode="contains" filterPlaceholder="Pesquisar por criação" />
            <Column field="updatedAt" header="Data Atualização" sortable filter filterMatchMode="contains" filterPlaceholder="Pesquisar por atualização" />
            <Column body={actionBodyTemplate} headerStyle={{ width: '4em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
          </DataTable>
          <Paginator
            rows={paginateFilter.total}
            first={paginateFilter.total * paginateFilter.current}
            currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords}"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            totalRecords={paginated.total}
            alwaysShow
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={(e) => dispatch(setPaginateFilter({ current: e.first, total: e.rows }))}
          />
        </Card>
      </Zoom>
    </div>
  );
};

export default EmployeeTypesPage;
