import React, {
  ChangeEvent, useEffect, useState, useMemo,
} from 'react';
import './styles.scss';
import { OrderList } from 'primereact/orderlist';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { v4 } from 'uuid';
import { TreinamentQuestion } from '../../../../store/modules/products/types';
import { StoreState } from '../../../../store';
import {
  setCreateTreinamentFormField,
} from '../../../../store/modules/products/slice';

interface QuestionOption {
  id: number;
  text: string;
  isOk: boolean;
}

interface QuestionForm {
  id: string;
  enunciated: string;
  secondsLimit: number;
  options: Array<QuestionOption>;
}

const CreateTreinament : React.FC = () => {
  const dispatch = useDispatch();
  const [menuRef, setMenuRef] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentForm, setCurrentForm] = useState<QuestionForm>({
    id: '',
    enunciated: '',
    secondsLimit: 10,
    options: [],
  });

  const {
    createTreinamentForm,
  } = useSelector((state: StoreState) => state.products);

  const handleClose = () => {
    setMenuRef(null);
  };

  const startCreate = () => {
    setCurrentForm({
      id: '',
      enunciated: '',
      secondsLimit: 10,
      options: [],
    });
    setShowModal(true);
  };

  const deleteQuestion = (id: string) => {
    dispatch(setCreateTreinamentFormField({ fieldName: 'questions', value: createTreinamentForm.questions.value.filter((q) => q.id !== id) }));
    handleClose();
  };

  const editQuestion = (question: TreinamentQuestion) => {
    setShowModal(true);
    setCurrentForm({
      id: question.id,
      enunciated: question.enunciated,
      secondsLimit: question.secondsLimit,
      options: question.options.map((o, i) => ({ id: i, isOk: o.isCorrect, text: o.content })),
    });
    handleClose();
  };

  const itemTemplate = (question: TreinamentQuestion) => (
    <div
      className="question-item"
    >
      <div className="question-item-detail">
        <h5 className="p-mb-2 question-header"><span>{question.enunciated}</span><span className="time">{question.secondsLimit} segundos</span></h5>
        {question.options.map((p) => (
          <div key={p.id}>
            {p.isCorrect ? <i className="pi pi-check" /> : <i className="pi pi-times" />}
            <span className="question-text" style={p.isCorrect ? { fontWeight: 'bold' } : {}}>{p.content}</span>
          </div>
        ))}
        <div className="menu-btn-area">
          <Button
            type="button"
            icon="pi pi-pencil"
            className="p-button-secondary btn-options"
            onClick={(ev) => {
              ev.stopPropagation();
              editQuestion(question);
            }}
          />
          <Button
            style={{ marginLeft: 5 }}
            type="button"
            icon="pi pi-trash"
            className="p-button-danger btn-options"
            onClick={(ev) => {
              ev.stopPropagation();
              deleteQuestion(question.id);
            }}
          />
        </div>
      </div>
    </div>
  );

  const isOkEditor = (props: any) => (
    <Checkbox
      onChange={(e) => {
        setCurrentForm({ ...currentForm, options: currentForm.options.map((o) => (o.id === props.rowData.id ? { ...o, isOk: !o.isOk } : o)) });
      }}
      checked={props.rowData.isOk}
    />
  );

  const textEditor = (props: any) => (
    <InputText
      id="text"
      name="text"
      value={props.rowData.text}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        setCurrentForm({ ...currentForm, options: currentForm.options.map((o) => (o.id === props.rowData.id ? { ...o, text: e.target.value } : o)) });
      }}
    />
  );

  const addCurrentOption = () => {
    const questions = createTreinamentForm.questions.value.concat([{
      id: v4(),
      options: currentForm.options.map((o) => ({ id: `${o.id}`, isCorrect: o.isOk, content: o.text })),
      secondsLimit: currentForm.secondsLimit,
      enunciated: currentForm.enunciated,
    }]);
    dispatch(setCreateTreinamentFormField({ fieldName: 'questions', value: questions }));
    setShowModal(false);
  };

  const updateCurrentOption = () => {
    const questions = createTreinamentForm.questions.value.map((o) =>
      (o.id === currentForm.id ? ({
        id: o.id,
        options: currentForm.options.map((qo) => ({ id: `${qo.id}`, isCorrect: qo.isOk, content: qo.text })),
        secondsLimit: currentForm.secondsLimit,
        enunciated: currentForm.enunciated,
      }) : o));
    dispatch(setCreateTreinamentFormField({ fieldName: 'questions', value: questions }));
    setShowModal(false);
  };

  const isOkTemplate = (rowData: any) => (rowData.isOk ? 'Sim' : 'Não');

  const renderFooter = () => (
    <div>
      <Button type="button" label="Cancelar" icon="pi pi-times" onClick={() => setShowModal(false)} className="p-button-text" />
      <Button type="button" label="Salvar" icon="pi pi-check" onClick={() => (currentForm.id ? updateCurrentOption() : addCurrentOption())} autoFocus />
    </div>
  );

  return (
    <div className="register-treinament">
      <Dialog
        style={{ width: '60vw' }}
        breakpoints={{ '960px': '75vw', '640px': '100vw' }}
        draggable={false}
        visible={showModal}
        onHide={() => setShowModal(false)}
        footer={renderFooter()}
      >
        <div className="p-grid" style={{ marginTop: 10 }}>
          <div className="p-col-9">
            <span className="p-float-label" style={{ marginTop: 27 }}>
              <InputText id="enunciated" name="enunciated" value={currentForm.enunciated} onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentForm({ ...currentForm, enunciated: e.target.value })} />
              <label htmlFor="enunciated">Enunciado</label>
            </span>
          </div>
          <div className="p-field p-col-3">
            <label htmlFor="vertical" style={{ display: 'block' }}>Tempo Límite</label>
            <InputNumber
              id="vertical"
              value={currentForm.secondsLimit}
              onValueChange={(e) => setCurrentForm({ ...currentForm, secondsLimit: e.value })}
              suffix=" seg"
              min={0}
              mode="decimal"
              showButtons
              buttonLayout="horizontal"
              decrementButtonClassName="p-button-secondary"
              incrementButtonClassName="p-button-secondary"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
          </div>
          <div className="p-col-12 table-area">
            <Button
              type="button"
              onClick={() => setCurrentForm({ ...currentForm, options: currentForm.options.concat([{ id: currentForm.options.length, text: '', isOk: false }]) })}
              icon="pi pi-plus"
              className="p-button-rounded btn-add"
            />
            <span className="options">Opções:</span>
            <DataTable value={currentForm.options} editMode="cell" className="editable-cells-table">
              <Column field="text" header="Conteúdo" editor={(props) => textEditor(props)} />
              <Column field="isOk" body={isOkTemplate} header="Opção Correta" editor={(props) => isOkEditor(props)} />
            </DataTable>
          </div>
        </div>
      </Dialog>
      <OrderList
        value={createTreinamentForm.questions.value}
        header={(
          <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
            <span style={{ flexGrow: 1 }}>Perguntas</span>
            <Button type="button" onClick={startCreate} icon="pi pi-plus" className="p-button-rounded" />
          </div>
        )}
        dragdrop={false}
        listStyle={{ height: 'auto' }}
        itemTemplate={itemTemplate}
        onChange={({ value }) => {
          console.log('passou no UPDATE', value);
          const questions = value as Array<TreinamentQuestion>;
          dispatch(setCreateTreinamentFormField({ fieldName: 'questions', value: questions }));
        }}
      />
      <span className="p-error p-d-block">{createTreinamentForm.questions.errors.join(', ')}</span>
    </div>
  );
};

export default CreateTreinament;
