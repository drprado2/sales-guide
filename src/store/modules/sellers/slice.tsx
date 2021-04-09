import React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import {
  Seller,
  SellerList,
  SellerState,
} from './types';
import {
  containsCapitalLetters,
  containsLowerCaseLetters,
  containsNumbers, isCnpj, isCpf, isCpfOrCnpj, isEmail,
  minLenght, pastDate,
  required, validPhone,
} from '../../validations/validations';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { PaginateFilter } from '../../types/PaginateFilter';

const initialState: SellerState = {
  loadingDelete: false,
  loadingGetById: false,
  loadingGetList: false,
  loadingSaveForm: false,
  createForm: {
    name: { value: '', validations: [required], errors: [] },
    avatarImage: { value: 'data:image/png;base64,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', validations: [required], errors: [] },
    birthDate: { value: undefined, validations: [pastDate], errors: [] },
    document: { value: '', validations: [required, isCpfOrCnpj], errors: [] },
    email: { value: '', validations: [required, isEmail], errors: [] },
    enable: { value: true, validations: [], errors: [] },
    phone: { value: '', validations: [validPhone], errors: [] },
    zoneId: { value: '', validations: [required], errors: [] },
    isCpf: { value: true, validations: [], errors: [] },
  },
  updateForm: {
    id: { value: '', validations: [], errors: [] },
    name: { value: '', validations: [required], errors: [] },
    avatarImage: { value: '', validations: [required], errors: [] },
    birthDate: { value: undefined, validations: [pastDate], errors: [] },
    document: { value: '', validations: [required, isCpfOrCnpj], errors: [] },
    enable: { value: true, validations: [], errors: [] },
    phone: { value: '', validations: [validPhone], errors: [] },
    zoneId: { value: '', validations: [required], errors: [] },
    isCpf: { value: true, validations: [], errors: [] },
  },
  viewData: {
    companyId: '',
    companyName: '',
    createdAt: format(new Date(), 'dd/MM/yyyy'),
    avatarImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABX1BMVEX///9LwZD/u5RFp5tRVXDr8fg5PFT7qHViZn7/vZVLwo//wJb/vJb8rX34VWVFqZ23kYY4NVA8pJg7vYlMUm+XycJBhYR2aXY+QVr/totFpZyCcHr/qHMnK0hHspfCwsdGrJnXo4xItpVJuZRcYHk4MVBGq5pKvZLd8ulaxpl4z6rA6NaK1LT1/Pmv4cvP7eDEmIie28Dr+PJFSWJBTW7ztJEpNFFaqZrtuZVpy6LI6tuY2bxDmZI+bXSDrZnNtZbU2uRAd24+Z2U8V187S1pDi3ZIrodFlnyOd3toYnRAe33NnYljUlqifnRvp5S3jHukp4t3YmbQqIDmqHnUtpYgOlOksJjv4dz1xKrx1srn5+msrbYVGz0/a2g6R1lCg3OJZmDcl3ConoJTTFuKp4+Ea2rqqHmKipVydIOcSFzMT2FHPlWuSl1WP1blUmNqQVjcW2fro4jYhXnbcXB3u7Qy9BYEAAASpUlEQVR4nO2dj1cTxxbHTQJJdxOE/LAEDGo0KAECSH4AyhMVRC0KWq1tsY/aaqtPW9+z5f8/b39kd2dn7p25s9mQ0MPX0x4lu8t8cu/ce2d2dvbcuTOd6UxnOtOZhkGrywtLNxfnN+qJhFksFs1Evb4xv3hzaWF5ddBN61WNuYXb8/WiI9M0LUDrv4T7F9P9cX3+5sJcY9ANjaS5hcWNhA2WkMtGTWwsLs0NusFaWl2aT3StRpJj0cT80ulw2sbyTYrpEGPeXh5yj20s304U9eEYzGJi8dbwQs4t1qMYTzBlfXF50CiQGkv1nqwXoizWl4bNkHOLVieKU8Xi4jBF1+X52MwXyCxu3Bo0WFcL8bknz1hfGDScpVv94nMZE4NmXNiIt/uJKtYH6atz/eh/vKz+OKiY01jU5PPKOHo55zEuDiR3LOnwmQ7VDU/eD+iMSyfON0fugDbK7u6De/e3d8r5WVv58s72/XsPdnc1rHnirnqTaEALYffBv3fSFlY+nw5k/Ss/m965/2CXCmkWb54g31ydZEAb795RfpZFC8v67OjeboIGWayfmBlJPdDFk9AFlGki5En1xtV5igHNxMNtAp4Huf2QxFicP4FB8nJC3RLLfg8o5mMZj36mMJqJvg+slggGNBMPLNcDVLbUtP8HfTibf0D48hJ9DjhWkicY8OERz1duNksjYZWaTR509ughwYzF+T6m/1VCEjR3t2c5Oh6OEUc5e3+XgFjvW2ecU3uRaf4cynvlJk4HQebzP6vNaJp9Shu3tA2oxutCsmbcppixL+MNQhY0H6YDAxLMBxoyn36o/kX9yIyEOs28N6tvP8COs/cIVow9pN5UuqiZuD8bmS/MOLut7vFxI95WAVo12o7voeUIfCHG/M6uMuAUb58s4I1COd+LAXnEcuHGSSKqXNRMXNpM92pAV0HE2bykYozPURWAZuJqKgCMbkDOjOnN1FVFd4wLUVGKmjeupzb9r15SvxBV8h11M3VdYcZ4ksYteZowL6XGU0exeKgn7+s6sq58SW7GOFL/nBTQNmBqfDsfJ6CPmN8ZTynMaBZ7LuBW5Qa8Om0B/itmwADxXxZi6qq8CT2W4Y265PJWCLUBv44dMED82kKcviLzVLPe22BKNh50PDQ1vtkHwABx07ai1FOL870AyvKEeS1la9yLMrECjox40Wbc+S3XZIg95IxlGaDdBZlOGDOglzTcrpialnXGYuS5m1X8olaScAE9H+09D2KIm64VL8niTdRoM49f1LyScn10J55KBlK3utlxCWWIZsSuKKllzCvTLuA3+T5EGU9utMl/00W8giNGq23mJJ3Qs+B0f6KMp+7Vpz1EvEGREr8kE3YB/TAD+2jtqxqR5Kuw/NOabLCRIpp1fUA8UZg+4KYsE9ZCjZWo9pUg76Ny2IgSR9VPGbiPWqU2Z0KZYdSIAGBwFmdESbjR9tMN7FIM4LQ0jvL2QATwCX4aGBFHNDf0ANE42k30bCBV2UZmRsiAoW8lHE5ldbhePG2ggNcCwFRZngqD1mOMCB97uGvEcspHnEYLuKJOCb6IXMW84X+X/piCZKCaCFmrwUycgjGGJ6wMNxfpgHiYuc4QbiurmbCNGMoa94nkGq4RtxnC61jjNIINFmb8POHEGZUJRUa1U6JGnGYQsWhDL94WEBMyUcaPM8qCVAmoukCTjzX4QIM8a4NUM2wn9Gtu9ZiiJrMj0D95lQQ3TU0jXZFa2WB30czrLOA0X86UQgpDkvwTu0CZS4l2V8SMSFvJCJ/MpHomkjb91tUuhjTCGVeE5KzHX6DmQzaFaCpJ/BRApBeGfdSr2LqtaD2qZsNqPxb9txZI9MXJNneF6qNW9zOucpOlDJIRsTHF9TDhDhNJW3tZIxmW0fYbSFHrUU64QnalFRD6A2HPTxFHI/REpBeG4qjfDV0nba1kk4IMY6JFndooWVfgAS15iE2xI6LxlBBOkamLGyFAb37GISw9AgDtBrYnSYyl1sU2coWLJZ/Qm68J4ilsCWVORMoZNtc7hG42dE1YBb5/14x7j5WuWmo93jOwC1RbvpuGMqIk2CgLG7gi5cKMF2jcXFFrIw20mpibqEntaPGtJPHT2zXnqDIQarA5VFV1igwqeBN2i1KHsDSJttA2o7E32UIgS63WxSpmP/f0yZJHGM75tpABv2KIAY8LmTGTR3gUdMNJuBP5rcy2JyZHWuEqwPpXa+TiShsKMIyyk0FHPOIJESMqxol12ITX+Yun8mRC25DZdnXi0WTNMpqjkdrko4mqhSfnCxPmhTYglY00YcBxBjDh9KwfaNSEDqSRTebannKGRafCCwidUDM7zRsRGQxLYw0SZwQTdpMFndDD9EQ8I0S4KbgpbERZrGmATmre4E3oVaWahPpiCfmEmELHGJI7ivC9JiGQeoTlEyMsi7W3IzicSu5FwU7K58IhIkyBhQ3upg3wbnJ41DRkhGBhYyYwN0VuiIqpYngI4SEG6qa3wS9ESBXDRAgnDBNb8QZ+H0CcGSJCrHSDAVdhJwVMOESE07Cbwre9wZrUvApcdogI4fsYSG0Kjn1BJx0mQtBNkXEwmCuAZMgTIkP8WAgfKQnBlGiCHRGsurvLgmSErRVqlakvY6+lJITdFKq+wVlE2ElZwlKtb3w24uOSihBM+uCsIlyyAek+TMjM0uQM60/OMDTHEKETcjn7KsFnbWd+QEYIJn2wcANvOMHdMCAsjVT9XphbmbC14mjPUrVazan52tWqffCee557CfbjxxajjBCcdIPueYNFKZwruoSdTuvx02AWyqhOiCL00RXgNGZuy8g9nRzpdHBCsCNCpSkcaOBu6BB23vwylhljHSoSYU5BmMyNZTK/vOnghGC+AEINfLsC7oYW4cyTXzKWxhg3tP3NVuBzEyv4RCP7xfh+vedeIXSWTWgxPpnBCMGOCIQasOwWR/ce4ZtMhie0HMoQpALkAo0TbMJnuYSZzBuMEOyIwAoiqKIBxxW2Cr9WAML+yCOs/FpACKHxBVDVQFM00ODXAXzXBUQJ6ZNN3vFKwkzlHYIIZkRxTlEn0KxlMlJCy9PaySzZvEY2186hjD5hJrMGNwcONTwgOHQyYc8vfFuREmarz9Odt0/VUaYLmHv6tpN+voeUtwFh5VvYiOCkojCAAmcwTLgb7lekNswe2OnLYqQh5tpv7cPTnacwImPDyj7YnmmQkJ/JgJMFSFjYkhIaVafBVpOfkAizz73j4bt0LOEWaERwFCykC3D4CyeLQiYjI8z+1m0x1GSr7MS+kHT6uYowk4EJr0GE/CAYWjCL1GxrFSlh8q3XYsHvclNjY1M84YFP2ATdmiWswLEGShdCQoRGFsgMxjspoZHDCaecc8I/ywaEZTXhO/JMhjC6ABM+mA4Lz+Q2zD7xCQ+4FkPnGHs+4VuAjyN8BroplBCFlA+NnaIRBm5XbnOfds8JH54rYybvjZAfP4ElDZjwC68U/dB44iLOHIBOyhH6Ruw8EZbUiIRwWQOmfL6ooROy6RAmTP7WsSWssoEJk9m9tH34cyHMAoRwQiQRguNfZOykILTv3K8c7CUFn0MIrSKvenCA3tIPEcINggiF6TboAX+EsPBCXtPYrQIHThihU6ijVSyb8V/QyzbT5AjBog0hfKUkhIUTysQSvtIpTCmEyJAz9fuACH9H2jMemRDph8Hw8GQJ0QEiyYYa/ZAdPp0kITZ4IvZDnVhq+6n+LIaV7bxzkLwgJ6xgPkqMpRr50FE3ntIJc1NB0NcyY5ew8gJvTNwZ39VWpaJDGBoDZfjyW3lmpbIlaQuJkF6XdlW488JipNswDJjhB1FSwkrlxR2sD9oi1aX0sYWn8cL+ry8yVMIpnpDu3pkXW/sFLHHhhPzYgj4+ZO1YSJFNEZkwaf8auUjjQ40xfkjrVEtE7ofr6kaQxvga8zSsxqmEySSLqBNL11UWJM7TaMy1sSq8JLc0h/xdpZdqQqjpwlybznwpS/isfzfxXRnwsD5ESJov1ZnzZgnf9Z0QK0YD0ea8te5bBBrf7zNgMrmv/Jpp9y207j2xooeaaFpXAsLrTcR7T1r3DwNphJpoIgQa4v1DrXvADOErZUfMZrNTsIyscjmVgQzrWULiPWCt+/iM1pSEz/Pvhd/m6n0evlXBEiL3DBlR7+PDazHUHbGg6Ij2BPEIQvg431Et1lDne2RRlLgWQ2s9DUuocFNjpZOeeQ0Cvp5Jd/YUZ6udlLyeRmtNFCuFmzp3z2Y+XBb1Ycb6gJ/4589WOyl5TZTWuraQERXRNOs8DjIjylk4pgg16kiqsa5NZ21iiPCO4vmzp/7NJUHYnW3fhNKBryv62kSd9aVhyWON0Q4Iv3MVECqclDBy0lhfqrNGOCRVrPFve3+X/s/Hz+fPf/zjU5ex85vChIQ4kwKdFF6sr7HOm0OUGzHX7t4h/OO8p4+fnB98UpmQAKizzltjrb6mEZ07hH9+Ps/ov9+hiy/0TKizVh953kL9S5RZP3swk/50Pqw/xTuoUUyo9byFxjMzPKEinNrLET5zhJ/zKkBKINV7ZkbjuScBcUuF+OV/POEXFSC8PIgzod5zT/Rn1wQp62+j/Rdrxc9/KZeEEcoZ7WfX6M8fClLPZhjZ9pe/P7p4f39RPaZOmr1IaT9/SH+GFEBU+anz0HrWXijdzqofU6f5qPYzpPTngCFE0nQG+SEMwuRFKsJzwORnuSHCWOekcvsUEyIP5Mt2h6Y+jw8iylOG1hp3UqKI8jw+eU8FGFFW2niPKviSxVJSMRNtTwX6vhi6iOLjJu1eASPti0He20QXEXigBjUiFTDa3ibU/Wn0EfmnotCqmwwYbX8a6h5DKCKa+amRhpbpbcGbYih3wCTuE4Uj3qE+hAArR4uiKdyEyg0wsW3KaT3RQlxbj45orK9RAeFhE2X/S9p+bVLGyPcUCfcKfUBsvzbCHvu0PfekiHcimdFYJ3toT3vuEfdNlCOmIpjReJaiA/a0byJt70sV49pLzYfXXpJ7oK2e9r6k7V+qZtx/SX5CzzBekiptX+j+pcRNaLFthEljjACxsL+Fb6fH8iW39pWLgkJC9kyk71qOGpEeT7uMa6+SipWW1sfP1vT4YthHGM2J5LzvaTxVsR90QiBt+KmxinzNGiDs/QEaG8+T9vOmyVmi6VCy62bdf0yNOQsrdS8Zx37epD3Z6YTuQq8x+8590vljaSxYva17yTj2ZCftqy9TwRfz9AmiSnAw5dIx7atPejcCzpc6Pr7QFYHQO/T4mJDy8dci6b5rhvB+C85agY5HA/2gQqysM0cfQ5cL/b7Y3m9BekeJ9dvHA2sFGmU1JUesTIWOFi92fDzOUEpew6L9Lh3Ve2YsugvwRUNNHj1U2PAwfDj8dV/opsw43zOjeFdQIYXgCYSj38uMWPl+lEBoafWC9TvjfVeQ7H1P5qULeNwa5fUjjlj5UTgavW7jwiW0QdHe94TH02Jddj2hzXi0qfwgHiy58hz6aveo7yNFireiPLOKjR5NwoiVJHCs9NrIe4mjvncNeXeesk+LrT4cAwn5KKMmxPwq8ps6oXtR6qAFNBuMNkKUUQPCiNHffwhdT+GiCCEUbYAoQyAE3hva20uBhesRojLUcDHaQFGGQihkMcJ3LhP/LlmKQ4AtH22HEcEoQyLkuo650du7ZLloQyv+wKbztQ0UZSiAQojv8X3A3DudaX0atk4o2oBRhkjIGjGGdzqH3stNrd/h1jPRBo4yNEB23GPG8V5uNqBSoxbc/CDaIFGGSqjfIJW8YYZknQonBKBb22BRhggYrPvp5V3HYXUR0cVUghCC0W5tg31MvXx3eVp8gF49qNGrEYTvHUAkypABu6soi+QvnCIbUWueAIGwog0WZTQInVgTL6DjqFpxC6P4AY0yGoD2rHycLurKCmBax6OIMQBapVv8gBaiZmSGOe7W7sYAqN0YmjTrPxhwpDQCI/a1LX0SCGgLQhx0Y6NJBHTe+VQqiYiDbmpUgRYcARx10A1lpdcBwoA1761dJS7c9LEFfRdgQZfxblTAoRMMGHLUQTexVwkuyjvqoBsISqsruBzv+RcEti7rAw5ZF/TlcFzmX/5cOjw3tBbUls3R4AE/dD8YYmm6zOvwG0lbh/1p1SD1nvXT1uVBN6cfeh0Em9I/EvDcofcW71Iz/Q/0UUuHM/4z3DN0wmHNEJDuMoR3B92YvugyQ3gK+yHBmV4zhPBWIKdd74O9FTrYjjWnW+/zPiG6J8/p1gdmy48Pg25ML0J7ZI0hrJ1ki05MZYawCR5xmnLfOaC5MwzhjPLo06JG0PTDnxjCn0aBI06vGjZD47BWa9rbKVkRtVmrHTa8D850pjOd6UxnGrz+D+oAKCkz4+U2AAAAAElFTkSuQmCC',
    id: '',
    name: '',
    totalProvesSent: 0,
    totalTreinamentDones: 0,
    updatedAt: format(new Date(), 'dd/MM/yyyy'),
    birthDate: undefined,
    document: '',
    email: '',
    enable: false,
    lastAccess: undefined,
    phone: '',
    zoneId: '',
    zoneName: '',
  },
  paginated: {
    data: [],
    total: 0,
  },
  paginateFilter: {
    current: 0,
    total: 10,
  },
  filter: {
    name: undefined,
    document: undefined,
    email: undefined,
    enable: undefined,
    lastAccess: undefined,
  },
};

const slice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    getList(state, action: PayloadAction) {
      state.loadingGetList = true;
    },
    onGetListSuccess(
      state,
      action: PayloadAction<PaginatedResponse<SellerList>>,
    ) {
      state.paginated = action.payload;
      state.loadingGetList = false;
    },
    onGetListFailure(state, action: PayloadAction) {
      state.loadingGetList = false;
      state.paginated = initialState.paginated;
    },
    getById(state, action: PayloadAction<string>) {
      state.loadingGetById = true;
    },
    onGetByIdSuccess(
      state,
      action: PayloadAction<Seller>,
    ) {
      state.viewData = action.payload;
      state.loadingGetById = false;
      state.updateForm.id.value = action.payload.id;
      state.updateForm.name.value = action.payload.name;
      state.updateForm.birthDate.value = action.payload.birthDate ? new Date(action.payload.birthDate) : undefined;
      state.updateForm.avatarImage.value = action.payload.avatarImage;
      state.updateForm.phone.value = action.payload.phone;
      state.updateForm.document.value = action.payload.document;
      state.updateForm.enable.value = action.payload.enable;
      state.updateForm.zoneId.value = action.payload.zoneId;
    },
    onGetByIdFailure(state, action: PayloadAction) {
      state.loadingGetById = false;
      state.viewData = initialState.viewData;
    },
    resetCreateForm(state, action: PayloadAction) {
      state.createForm = initialState.createForm;
    },
    resetUpdateForm(state, action: PayloadAction) {
      state.updateForm = initialState.updateForm;
    },
    resetViewData(state, action: PayloadAction) {
      state.viewData = initialState.viewData;
    },
    setCreateFormField(state, action: PayloadAction<{fieldName: string, value: any}>) {
      const { fieldName, value } = action.payload;
      const f = state.createForm[fieldName];
      f.value = value;
      f.errors = [];
      if (fieldName === 'isCpf' && value === true) {
        state.createForm.document.validations = [required, isCpf];
      } else if (fieldName === 'isCpf' && value === false) {
        state.createForm.document.validations = [required, isCnpj];
      }
      f.validations.forEach((v) => {
        const error = v(value);
        if (error) {
          f.errors.push(error);
        }
      });
    },
    setUpdateFormField(state, action: PayloadAction<{fieldName: string, value: any}>) {
      const { fieldName, value } = action.payload;
      const f = state.updateForm[fieldName];
      f.value = value;
      f.errors = [];
      if (fieldName === 'isCpf' && value === true) {
        state.createForm.document.validations = [required, isCpf];
      } else if (fieldName === 'isCpf' && value === false) {
        state.createForm.document.validations = [required, isCnpj];
      }
      f.validations.forEach((v) => {
        const error = v(value);
        if (error) {
          f.errors.push(error);
        }
      });
    },
    validateCreateForm(state) {
      for (const formKey in state.createForm) {
        state.createForm[formKey].errors = [];
        state.createForm[formKey].validations.forEach((v) => {
          const error = v(state.createForm[formKey].value);
          if (error) {
            state.createForm[formKey].errors.push(error);
          }
        });
      }
    },
    validateUpdateForm(state) {
      for (const formKey in state.updateForm) {
        state.updateForm[formKey].errors = [];
        state.updateForm[formKey].validations.forEach((v) => {
          const error = v(state.updateForm[formKey].value);
          if (error) {
            state.updateForm[formKey].errors.push(error);
          }
        });
      }
    },
    createRequest(state, action: PayloadAction<{(): void}>) {
      state.loadingSaveForm = true;
      state.callBackCreate = action.payload;
    },
    onCreateSuccess(state, action: PayloadAction) {
      state.loadingSaveForm = false;
      state.callBackCreate?.call({});
    },
    onCreateFailure(state, action: PayloadAction) {
      state.loadingSaveForm = false;
    },
    updateRequest(state, action: PayloadAction<{(): void}>) {
      state.loadingSaveForm = true;
      state.callBackUpdate = action.payload;
    },
    onUpdateSuccess(state, action: PayloadAction) {
      state.loadingSaveForm = false;
      state.callBackUpdate?.call({});
    },
    onUpdateFailure(state, action: PayloadAction) {
      state.loadingSaveForm = false;
    },
    deleteRequest(state, action: PayloadAction<{id: string, callBack?: {(): void}}>) {
      state.loadingDelete = true;
      state.callBackDelete = action.payload.callBack;
    },
    onDeleteSuccess(state, action: PayloadAction<string>) {
      state.loadingDelete = false;
      state.callBackDelete?.call({});
    },
    onDeleteFailure(state, action: PayloadAction) {
      state.loadingDelete = false;
    },
    setPaginateFilter(state, action: PayloadAction<PaginateFilter>) {
      state.loadingGetList = true;
      state.paginateFilter = { total: action.payload.total, current: action.payload.current / action.payload.total };
    },
    setFilter(state, action: PayloadAction<{propName: string, value: any}>) {
      state.filter[action.payload.propName] = action.payload.value;
    },
  },
});

export const {
  createRequest,
  deleteRequest,
  getById,
  getList,
  onCreateFailure,
  onCreateSuccess,
  onDeleteFailure,
  onDeleteSuccess,
  onGetByIdFailure,
  onGetByIdSuccess,
  onGetListFailure,
  onGetListSuccess,
  onUpdateFailure,
  onUpdateSuccess,
  resetCreateForm,
  resetUpdateForm,
  setCreateFormField,
  setUpdateFormField,
  updateRequest,
  setPaginateFilter,
  resetViewData,
  validateCreateForm,
  validateUpdateForm,
  setFilter,
} = slice.actions;

export default slice.reducer;
