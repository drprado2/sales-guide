import React, {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  Prompt,
} from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import {
  setCreateFormField, resetCreateForm, createRequest, validateCreateForm, getOptions,
} from '../../../../store/modules/employeeTypes/slice';
import { StoreState } from '../../../../store';
import { isValid } from '../../../../store/validations/validations';

interface Props {
  isOpen: boolean;
  onCancel: {(): void}
  onSave: {(): void}
}

const CreateEmployeeTypeModal : React.FC<Props> = ({ isOpen, onSave, onCancel }) => {
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch();
  const [isBlocking, setIsBlocking] = useState(false);

  const {
    loadingSaveForm, createForm,
  } = useSelector((state: StoreState) => state.employeeTypes);

  const onSaveSuccess = () => {
    toast.current?.show({
      severity: 'success', summary: 'Salvo!', detail: 'Tipo de contratação salvo com sucesso!', life: 1500,
    });
    setTimeout(onSave, 1500);
  };

  const onFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    saveForm();
  };

  const saveForm = () => {
    setIsBlocking(false);
    dispatch(createRequest(onSaveSuccess));
  };

  const footer = (
    <div>
      <Button type="button" label="Cancelar" className="p-button-text" onClick={onCancel} />
      <Button type="button" onClick={saveForm} label="Salvar" disabled={!isValid(createForm) || loadingSaveForm} icon={loadingSaveForm ? 'pi pi-spin pi-spinner' : ''} iconPos="right" />
    </div>
  );

  return (
    <>
      <Dialog
        header="Criar Tipo de Contratação"
        visible={isOpen}
        style={{ width: '60vw' }}
        breakpoints={{ '960px': '75vw', '640px': '100vw' }}
        footer={footer}
        onHide={() => {
          onCancel();
        }}
        onShow={() => {
          dispatch(resetCreateForm());
          dispatch(validateCreateForm());
        }}
      >
        <div id="edit-employeeType-page" className="p-grid p-align-center">
          <Toast ref={toast} />
          <Prompt
            when={isBlocking}
            message={(loc) =>
              'Deseja realmente prosseguir? suas alterações serão perdidas.'
            }
          />
          <div className="p-col-12" style={{ position: 'relative' }}>
            <form onSubmit={onFormSubmit}>
              <div className="p-grid">
                <div className="p-col-6">
                  <span className="p-float-label">
                    <InputText
                      id="name"
                      aria-describedby="name-help"
                      className={createForm.name?.errors?.length > 0 ? 'p-invalid' : ''}
                      value={createForm.name.value}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setIsBlocking(true);
                        dispatch(setCreateFormField({ fieldName: e.target.id, value: e.target.value }));
                      }}
                    />
                    <small id="name-help" className="p-error p-d-block">{createForm.name.errors.join(', ')}</small>
                    <label htmlFor="name">Nome</label>
                  </span>
                </div>
                <div className="p-col-6">
                  <span className="p-float-label">
                    <InputTextarea
                      id="description"
                      aria-describedby="description-help"
                      className={createForm.description?.errors?.length > 0 ? 'p-invalid' : ''}
                      value={createForm.description.value}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        setIsBlocking(true);
                        dispatch(setCreateFormField({ fieldName: e.target.id, value: e.target.value }));
                      }}
                      rows={5}
                      cols={30}
                      autoResize
                    />
                    <small id="name-help" className="p-error p-d-block">{createForm.description.errors.join(', ')}</small>
                    <label htmlFor="description">Descrição</label>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CreateEmployeeTypeModal;
