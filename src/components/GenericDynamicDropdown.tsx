import React from 'react'
import { Controller, type Control } from 'react-hook-form';
import CustomDropDownField from './CustomDropDown';
import useAxios from '../hooks/useAxios';

interface GenericDynamicDropdownProps<T> {
    items: T[];
    getValue: (item: T) => string;
    getLabel: (item: T) => string;
    control: Control<any>;
    inputName: string;
    inputLabel: string;
}

const GenericDynamicDropdown = <T,>({ items, getValue, getLabel, control, inputName, inputLabel }: GenericDynamicDropdownProps<T>) => {
    return (
        <Controller
            name={inputName}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <CustomDropDownField
                    {...field}
                    label={inputLabel}
                    errorText={error?.message}
                    values={
                        items.map(item => ({
                            label: getLabel(item),
                            value: getValue(item)
                        }))
                    }
                />
            )}
        />
    )
}

export default GenericDynamicDropdown
