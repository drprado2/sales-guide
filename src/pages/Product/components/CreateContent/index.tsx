import React, {
  ChangeEvent, useCallback, useEffect,
  useRef, useState,
} from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import SunEditor, { buttonList } from 'suneditor-react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { Dialog } from 'primereact/dialog';
import { v4 } from 'uuid';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import katex from 'katex';
import { Accordion, AccordionTab } from 'primereact/accordion';
import {
  DndProvider,
} from 'react-dnd';
import update from 'immutability-helper';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { StoreState } from '../../../../store';
import { setCreateFormField } from '../../../../store/modules/products/slice';
import { fileToBase64 } from '../../../../utils/file-utils';
import 'katex/dist/katex.min.css';
import { Content } from '../../../../store/modules/products/types';
import ContentItem from '../ContentItem';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

interface Props {
  images: Array<string>;
  productName: string;
}

interface ContentForm {
  id: string;
  icon?: string;
  title: string;
  label?: string;
  isCollapsable: boolean;
}

const CreateContent : React.FC<Props> = ({ images, productName }) => {
  const dispatch = useDispatch();
  const editorRef = useRef<SunEditor>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentForm, setCurrentForm] = useState<ContentForm>({
    id: '',
    isCollapsable: false,
    title: '',
    label: '',
  });
  const [editorContent, setEditorContent] = useState<string>('');
  const iconRef = useRef<HTMLInputElement>(null);

  const {
    createForm,
  } = useSelector((state: StoreState) => state.products);

  const reOrderContentBlock = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = createForm.contents.value[dragIndex];

      const newContents = update<Array<Content>>(createForm.contents.value, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      });
      dispatch(setCreateFormField({ fieldName: 'contents', value: newContents }));
    },
    [createForm],
  );

  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  const resetCurrentForm = () => {
    setCurrentForm({
      id: '',
      isCollapsable: false,
      title: '',
    });
    setEditorContent('');
  };

  const updateCurrentContent = () => {
    const newContets = createForm.contents.value.map((c) => {
      if (c.id === currentForm.id) {
        return {
          id: currentForm.id,
          content: editorContent === '<p><br></p>' || editorContent === '<p></p>' ? '' : editorContent,
          title: currentForm.title,
          icon: currentForm.icon,
          isCollapsable: currentForm.isCollapsable,
          label: currentForm.label,
        };
      }
      return { ...c };
    });
    dispatch(setCreateFormField({ fieldName: 'contents', value: newContets }));
    toggleModal();
    resetCurrentForm();
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const addCurrentContent = () => {
    const newContets = createForm.contents.value.concat([{
      id: v4(),
      content: editorContent === '<p><br></p>' || editorContent === '<p></p>' ? '' : editorContent,
      title: currentForm.title,
      icon: currentForm.icon,
      isCollapsable: currentForm.isCollapsable,
      label: currentForm.label,
    }]);
    dispatch(setCreateFormField({ fieldName: 'contents', value: newContets }));
    toggleModal();
    resetCurrentForm();
  };

  const renderFooter = () => (
    <div>
      <Button
        type="button"
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => {
          toggleModal();
          resetCurrentForm();
        }}
        className="p-button-text"
      />
      <Button type="button" label="Salvar" icon="pi pi-check" onClick={() => (currentForm.id ? updateCurrentContent() : addCurrentContent())} autoFocus />
    </div>
  );

  const onIconSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const base64 = await fileToBase64(file);
      setCurrentForm({ ...currentForm, icon: base64 });
    }
  };

  const deleteContentItem = (id: string) => {
    dispatch(setCreateFormField({ fieldName: 'contents', value: createForm.contents.value.filter((c) => c.id !== id) }));
  };

  const editItem = (id: string) => {
    const item = createForm.contents.value.find((c) => c.id === id);
    if (!item) return;
    setCurrentForm({
      id: item.id,
      title: item.title,
      icon: item.icon,
      label: item.label,
      isCollapsable: item.isCollapsable,
    });
    setEditorContent(item.content ?? '');
    toggleModal();
  };

  return (
    <div id="register-content">
      <Dialog
        style={{ width: '60vw' }}
        breakpoints={{ '960px': '75vw', '640px': '100vw' }}
        draggable={false}
        visible={showModal}
        onHide={() => {
          resetCurrentForm();
          toggleModal();
        }}
        footer={renderFooter()}
        header="Conteúdo"
      >
        <div className="p-grid modal-area">
          <div className="p-col-1">
            <div onClick={() => iconRef?.current?.click()} className="icon-form p-shadow-3" style={{ backgroundImage: `url(${currentForm.icon})` }}>
              <label className="image-label" htmlFor="icon">Ícone</label>
              <input onChange={onIconSelect} style={{ display: 'none' }} ref={iconRef} type="file" id="icon" name="icon" accept="image/png, image/jpeg" />
            </div>
          </div>
          <div className="p-col-5">
            <span className="p-float-label">
              <InputText id="title" name="title" value={currentForm.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentForm({ ...currentForm, title: e.target.value })} />
              <label htmlFor="title">Título</label>
            </span>
          </div>
          <div className="p-col-5">
            <span className="p-float-label">
              <InputText id="label" name="label" value={currentForm.label} onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentForm({ ...currentForm, label: e.target.value })} />
              <label htmlFor="label">Sub Título</label>
            </span>
          </div>
          <div className="p-col-1">
            <label>Retratil?</label>
            <InputSwitch checked={currentForm.isCollapsable} onChange={(e) => setCurrentForm({ ...currentForm, isCollapsable: e.value })} />
          </div>
          <div className="p-col-12 content-form">
            <label>Conteúdo</label>
            <SunEditor
              lang="pt_br"
              width="350px"
              defaultValue={editorContent}
              onChange={setEditorContent}
              ref={editorRef}
              setOptions={{
                katex,
                minHeight: 400,
                buttonList: [
                  ['undo', 'redo', 'showBlocks', 'codeView'],
                  ['font', 'fontSize', 'formatBlock'],
                  ['paragraphStyle', 'blockquote'],
                  ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                  ['fontColor', 'hiliteColor', 'textStyle'],
                  ['outdent', 'indent'],
                  ['align', 'horizontalRule', 'list', 'lineHeight'],
                  ['table', 'link', 'image', 'video', 'math'],
                ],
              }}
            />
          </div>
        </div>
      </Dialog>
      <div className="mobile-phone">
        <Button icon="pi pi-plus" type="button" className="btn-add p-button-rounded p-button-lg" onClick={toggleModal} />
        <div className="screen">
          <div className="header-bar">
            <i className="pi pi-arrow-left" />
            <span>{productName}</span>
            <i className="pi pi-bars" />
          </div>
          <div className="images-area p-shadow-3">
            <AutoPlaySwipeableViews enableMouseEvents autoPlay draggable index={carouselIndex} onChangeIndex={(index) => setCarouselIndex(index)}>
              {images.map((i) => (
                <div className="carousel-img">
                  <img
                    key={i}
                    src={i}
                    onError={(e: any) => {
                      e.target.src = 'https://reactnativecode.com/wp-content/uploads/2018/01/Error_Img.png';
                    }}
                    alt="Foto produto"
                    width="100%"
                    height="100%"
                  />
                </div>
              ))}
            </AutoPlaySwipeableViews>
          </div>
          <DndProvider backend={HTML5Backend}>
            {
              createForm.contents.value.map((c, i) => (c.isCollapsable ? (
                <ContentItem
                  onEdit={editItem}
                  onDelete={deleteContentItem}
                  key={c.id}
                  index={i}
                  id={c.id}
                  moveCard={reOrderContentBlock}
                >
                  <Accordion className="content-wrapper p-shadow-2">
                    <AccordionTab headerTemplate={(
                      <div className="content-collpase-block">
                        {c.icon ? <img className="content-icon" src={c.icon} alt="Ícone" width="20px" height="20px" /> : null}
                        <span className="content-title">{c.title}</span>
                        <span className="content-label">{c.label}</span>
                      </div>
                      )}
                    >
                      <div
                        className="content-text"
                        dangerouslySetInnerHTML={{
                          __html: c.content ?? '',
                        }}
                      />
                    </AccordionTab>
                  </Accordion>
                </ContentItem>
              )
                : (
                  <ContentItem
                    onEdit={editItem}
                    onDelete={deleteContentItem}
                    key={c.id}
                    index={i}
                    id={c.id}
                    moveCard={reOrderContentBlock}
                  >
                    <div className="content-wrapper p-shadow-2">
                      <div className="content-block">
                        {c.icon ? <img className="content-icon" src={c.icon} alt="Ícone" width="20px" height="20px" /> : null}
                        <span className="content-title">{c.title}</span>
                        <span className="content-label">{c.label}</span>
                      </div>
                      {c.content && (
                        <div
                          className="content-text"
                          dangerouslySetInnerHTML={{
                            __html: c.content,
                          }}
                        />
                      )}
                    </div>
                  </ContentItem>
                )))
            }
          </DndProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateContent;
