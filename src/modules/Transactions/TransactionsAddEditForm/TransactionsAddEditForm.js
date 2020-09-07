import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import { uid } from "react-uid";
import moment from "moment";

import NodesServices from "../../../services/nodes";
import TransactionsServices from "../../../services/transactions";

import Autocomplete from "../../../shared/Autocomplete/Autocomplete";
import Calendar from "../../../shared/Calendar/Calendar";

import styles from "./TransactionsAddEditForm.module.css";

const dateFormat = "MM-DD-YYYY";

const resetFields = {
  from: "",
  to: "",
  datePretty: "",
  postDate: "",
  amount: "",
  notes: "",
};

// autocomplete names
const autocompleteName = async (name) => {
  console.log("autocomplete");
  const list = await NodesServices.getNameAutocomplete(name);
  if (!list) {
    return null;
  }

  return list.map((orig) => ({ ...orig, id: orig.rowid }));
};

export default function TransactionsAddEditForm({ editId, closeHandler }) {
  const origFields = useRef(resetFields);
  const [addOrEdit, setAddOrEdit] = useState("add");
  const [isConfirmed, setIsConfirmed] = useState(null);
  const [toggleCalendar, setToggleCalendar] = useState(false);
  const toggleCalendarTimeoutId = useRef();
  const [disableSubmit, setDisableSubmit] = useState(true);
  // form fields
  const [formFields, setFormFields] = useState(resetFields);

  // Edit or Add
  useEffect(() => {
    if (!editId && addOrEdit !== "add") {
      setAddOrEdit("add");
      return;
    }

    if (editId && addOrEdit !== "edit") {
      setAddOrEdit("edit");
    }
  }, [editId]);

  // Edit Initializer
  useEffect(() => {
    if (addOrEdit === "edit") {
      (async () => {
        const transactions = await TransactionsServices.getTransaction({
          id: editId,
        });

        if (!transactions) return;

        const { id, ...stripped } = transactions;
        origFields.current = { ...stripped };

        setFormFields({
          from: transactions.from || formFields.from,
          to: transactions.to || formFields.to,
          datePretty: transactions.datePretty || formFields.datePretty,
          date: transactions.postDate || formFields.postDate,
          amount: transactions.amount || formFields.amount,
          notes: transactions.notes || formFields.notes,
        });
      })();
    }
  }, [addOrEdit]);

  // disable form
  useEffect(() => {
    setDisableSubmit(isEqual(origFields.current, formFields));
  }, [formFields]);

  // reset form
  useEffect(() => {
    if (!isConfirmed || isConfirmed.error) {
      return;
    }

    if (addOrEdit === "edit") {
      closeHandler();
      return;
    }

    setFormFields(resetFields);
  }, [isConfirmed]);

  const submitHandler = async (event) => {
    event.preventDefault();
    console.info("TransactionsAddEditForm - clicked");

    setIsConfirmed(null);

    try {
      const receipt = await TransactionsServices.addTransactions([
        {
          ...(addOrEdit === "edit" && { id: editId }),
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

  useEffect(() => {
    if (!formFields.postDate) {
      return;
    }
    setFormFields({
      ...formFields,
      datePretty: moment(formFields.postDate).format(dateFormat),
    });
  }, [formFields.postDate]);

  return (
    <div>
      <h1>{`${addOrEdit === "edit" ? "Edit" : "Add"} Transaction`}</h1>
      <form className="pure-form pure-form-aligned" onSubmit={submitHandler}>
        <div className="pure-control-group">
          <label htmlFor={uid("From")}>From:</label>
          <Autocomplete
            id={uid("From")}
            onOptions={autocompleteName}
            onChange={(event) => {
              setFormFields({
                ...formFields,
                from: event,
              });
            }}
          />
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid("To")}>To:</label>
          <Autocomplete
            id={uid("To")}
            onOptions={autocompleteName}
            onChange={(event) => {
              setFormFields({
                ...formFields,
                to: event,
              });
            }}
          />
        </div>

        <div
          className={`pure-control-group ${styles["date-group"]}`}
          onFocus={() => {
            clearTimeout(toggleCalendarTimeoutId.current);
            setToggleCalendar(true);
          }}
          onBlur={() => {
            toggleCalendarTimeoutId.current = setTimeout(() => {
              setToggleCalendar(false);
            });
          }}
        >
          <label htmlFor={uid("DatePretty")}>Date:</label>
          <input
            id={uid("DatePretty")}
            type="text"
            value={formFields.datePretty}
            onChange={(event) => {
              setFormFields({
                ...formFields,
                postDate: moment(event.target.value, dateFormat).valueOf(),
              });
            }}
          />
          <input
            hidden
            readOnly
            id={uid("Date")}
            type="text"
            value={formFields.postDate}
          />
          {toggleCalendar && (
            <Calendar
              className={`${styles["date-calendar"]}`}
              value={formFields.postDate}
              onChange={(date) =>
                setFormFields({
                  ...formFields,
                  postDate: date,
                })
              }
            />
          )}
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid("Amount")}>Amount:</label>
          <input
            id={uid("Amount")}
            type="text"
            value={formFields.amount}
            onChange={(event) => {
              const filter = /[^0-9.]/gi;
              setFormFields({
                ...formFields,
                amount: event.target.value.replace(filter, ""),
              });
            }}
          />
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid("Notes")}>Notes:</label>
          <textarea
            id={uid("Notes")}
            type="text"
            value={formFields.notes}
            onChange={(event) => {
              setFormFields({
                ...formFields,
                notes: event.target.value,
              });
            }}
          />
        </div>

        <div className="pure-controls">
          <button
            type="submit"
            className="pure-button pure-button-primary"
            disabled={disableSubmit}
          >
            {`${addOrEdit === "edit" ? "Edit" : "Add"} Transaction`}
          </button>

          <button type="button" className="pure-button" onClick={closeHandler}>
            Cancel
          </button>

          {/* {addOrEdit === "edit" && (
            <NodesRemoveButton id={editId}>Delete</NodesRemoveButton>
          )} */}
        </div>
      </form>
      {isConfirmed && isConfirmed.success && <span>...Added</span>}
      {isConfirmed && isConfirmed.error && (
        <span>{isConfirmed.errorMessage}</span>
      )}
    </div>
  );
}

TransactionsAddEditForm.propTypes = {
  closeHandler: PropTypes.func,
  editId: PropTypes.number,
};

TransactionsAddEditForm.defaultProps = {
  closeHandler: () => {},
  editId: undefined,
};
