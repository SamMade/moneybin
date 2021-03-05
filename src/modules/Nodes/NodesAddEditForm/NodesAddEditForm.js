import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { uid } from 'react-uid';
import NodesServices from '../../../services/nodes';

import NodesRemoveButton from '../NodesRemoveButton/NodesRemoveButton';

const defaultType = 'Person';

const resetFields = {
  name: '',
  type: defaultType,
  isDefault: false,
  alias: [],
};

export default function NodesPostForm({ editId, closeHandler }) {
  const origFields = useRef(resetFields);
  const [addOrEdit, setAddOrEdit] = useState('add');
  const [isConfirmed, setIsConfirmed] = useState(null);
  const [disableSubmit, setDisableSubmit] = useState(true);
  // form fields
  const [formFields, setFormFields] = useState(resetFields);

  // Edit or Add
  useEffect(() => {
    if (!editId && addOrEdit !== 'add') {
      setAddOrEdit('add');
      return;
    }

    if (editId && addOrEdit !== 'edit') {
      setAddOrEdit('edit');
    }
  }, [editId]);

  // Edit Initializer
  useEffect(() => {
    if (addOrEdit === 'edit') {
      (async () => {
        const nodes = await NodesServices.getNode({
          id: editId,
        });

        if (!nodes) return;

        const { id, ...stripped } = nodes;
        origFields.current = { isDefault: false, ...stripped };

        setFormFields({
          name: nodes.name || formFields.name,
          type: nodes.type || formFields.type,
          isDefault: nodes.isDefault || formFields.isDefault,
          alias: nodes.alias || formFields.alias,
        });
      })();
    }
  }, [addOrEdit]);

  // disable form
  useEffect(() => {
    setDisableSubmit(isEqual(origFields.current, formFields));
  }, [formFields]);

  // reset fields
  useEffect(() => {
    if (!isConfirmed || isConfirmed.error) {
      return;
    }

    if (addOrEdit === 'edit') {
      closeHandler();
      return;
    }

    setFormFields(resetFields);
  }, [isConfirmed]);

  const aliasChangeHandler = (alias, index) => {
    const updateAlias = [...formFields.alias];
    updateAlias[index] = alias;

    setFormFields({
      ...formFields,
      alias: updateAlias,
    });
  };

  const addAliasHandler = () => {
    setFormFields({
      ...formFields,
      alias: formFields.alias.concat(['']),
    });
  };

  const removeAliasHandler = (index) => {
    if (index >= formFields.alias.length || index < 0) {
      return;
    }

    setFormFields({
      ...formFields,
      alias: formFields.alias.filter((_, aliasIndex) => aliasIndex !== index),
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.info('NodesPostForm - clicked');

    setIsConfirmed(null);

    try {
      const receipt = await NodesServices.postNodes([
        {
          ...(addOrEdit === 'edit' && { id: editId }),
          ...formFields,
        },
      ]);
    } catch (e) {
      console.error(e);
      setIsConfirmed({
        error: true,
        errorMessage: e.message,
      });
      return;
    }

    setIsConfirmed({
      success: true,
      error: false,
    });
  };

  return (
    <div>
      <h1>{`${addOrEdit === 'edit' ? 'Edit' : 'Add'} Node`}</h1>
      <form className="pure-form pure-form-aligned" onSubmit={submitHandler}>
        <div className="pure-control-group">
          <label htmlFor={uid('name')}>Name:</label>
          <input
            id={uid('name')}
            type="text"
            value={formFields.name}
            onChange={(e) => {
              setFormFields({
                ...formFields,
                name: e.target.value,
              });
            }}
          />
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid('type')}>Type:</label>
          <select
            id={uid('type')}
            value={formFields.type}
            onChange={(e) => {
              setFormFields({
                ...formFields,
                type: e.target.value,
              });
            }}
          >
            <option value="Person">Person</option>
            <option value="Bank">Bank</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Organization">Organization</option>
          </select>
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid('Default')}>Default:</label>
          <input
            id={uid('Default')}
            type="checkbox"
            checked={formFields.isDefault}
            onChange={(e) => {
              setFormFields({
                ...formFields,
                isDefault: e.target.checked,
              });
            }}
          />
          <br />
          <span>Enable to specify the primary account</span>
        </div>

        <div>
          <button type="button" onClick={addAliasHandler}>
            + add aliases
          </button>

          {formFields.alias.map((alias, aliasIndex) => (
            <div
              key={uid('aliaskey', aliasIndex)}
              className="pure-control-group"
            >
              <label htmlFor={uid('Alias', aliasIndex)}>
                Aliases #{aliasIndex + 1}:
              </label>
              <input
                id={uid('Alias', aliasIndex)}
                type="text"
                value={alias}
                onChange={(e) => {
                  aliasChangeHandler(e.target.value, aliasIndex);
                }}
              />
              <button
                type="button"
                onClick={() => removeAliasHandler(aliasIndex)}
              >
                [x]
              </button>
            </div>
          ))}
        </div>

        <div className="pure-controls">
          <button
            type="submit"
            className="pure-button pure-button-primary"
            disabled={disableSubmit}
          >
            {`${addOrEdit === 'edit' ? 'Edit' : 'Add'} Node`}
          </button>

          <button type="button" className="pure-button" onClick={closeHandler}>
            Cancel
          </button>

          {addOrEdit === 'edit' && (
            <NodesRemoveButton id={editId}>Delete</NodesRemoveButton>
          )}
        </div>
      </form>
      {isConfirmed && (
        <span>{`...${addOrEdit === 'edit' ? 'Edit' : 'Add'}ed`}</span>
      )}
    </div>
  );
}

NodesPostForm.propTypes = {
  closeHandler: PropTypes.func,
  editId: PropTypes.number,
};

NodesPostForm.defaultProps = {
  closeHandler: () => {},
  editId: undefined,
};
