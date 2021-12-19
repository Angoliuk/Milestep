import React from "react";
import { Input } from "../input/Input";
import UsersOptions from "../options/UsersOptions";
import { Select } from "../select/Select";

export function InputsAboutCompany(props) {

    const {changeHandlerForm, eForm} = props

    return(
        <div>
            <h1>Інформація про компанію {eForm.name}</h1>
            <Input
                name='name' 
                onChange={changeHandlerForm} 
                value={eForm.name} 
                htmlFor='Назва' 
            />
            <Input 
                name='edrpou' 
                onChange={changeHandlerForm} 
                value={eForm.edrpou} 
                type='number' 
                htmlFor='ЄДРПОУ' 
            />
            <Input 
                name='address' 
                onChange={changeHandlerForm} 
                value={eForm.address} 
                htmlFor='Адреса' 
            />
            <Input 
                name='phoneNum' 
                onChange={changeHandlerForm} 
                value={eForm.phoneNum} 
                type='number' 
                htmlFor='Номер телефону' 
            />
            <Input 
                name='kwed' 
                onChange={changeHandlerForm} 
                value={eForm.kwed} 
                htmlFor='Основний КВЕД' 
            />
            <Input 
                name='payerPDW' 
                onChange={changeHandlerForm} 
                value={eForm.payerPDW} 
                htmlFor='Платник ПДВ' 
            />
            <Input 
                name='taxationSystem' 
                onChange={changeHandlerForm} 
                value={eForm.taxationSystem} 
                htmlFor='Сиcтема оподаткування'
            />
            <Input 
                name='infoESW' 
                onChange={changeHandlerForm} 
                value={eForm.infoESW} 
                htmlFor='Інформація про сплату ЄСВ' 
            />
            <Input 
                name='numOfWorkers' 
                onChange={changeHandlerForm} 
                value={eForm.numOfWorkers} 
                type='number' 
                htmlFor='Всього робітників' 
            />
            <Select 
                onChange={changeHandlerForm} 
                value={eForm.responsible} 
                name="responsible" 
                OptionsList={UsersOptions} 
                label='Відповідальний' 
            />
            <Input 
                name='haveLicenses' 
                onChange={changeHandlerForm} 
                value={eForm.haveLicenses} 
                classes='checkbox' 
                type='checkbox' 
                htmlFor='Ліцензування' 
            />
    </div>
    )
}