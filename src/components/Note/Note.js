import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

// CSS
import CSSModules from 'react-css-modules';
import styles from './style.module.sass';

// Actions
import { selectNote } from '../../store/tab/actions';

function Note({
	part_id,
	block_id,
	column_id,
	line_id,
}) {
	const dispatch = useDispatch();

	function handleNote() {
		dispatch(
			selectNote(
				part_id,
				block_id,
				column_id,
				line_id,
			),
		);
	}

	const note_id = `${part_id}-${block_id}-${column_id}-${line_id}`;
	const note = useSelector(store => store.tab.notes[note_id], shallowEqual) || {};
	const note_value = note.value || '';
	const selected_note = useSelector(store => store.tab.selected_note, shallowEqual) || {};
	const { p, b, c, l } = selected_note;
	const selected_note_id = `${p}-${b}-${c}-${l}`;

	const note_class = note_id === selected_note_id
		? 'note selected'
		: 'note';

	return (
		<button
			type="button"
			styleName={note_class}
			onClick={handleNote}
		>
			{note_value !== '' && <span>{note_value}</span>}
		</button>
	);
}

Note.propTypes = {
	part_id: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]).isRequired,
	block_id: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]).isRequired,
	column_id: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]).isRequired,
	line_id: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]).isRequired,
};

export default CSSModules(Note, styles, { allowMultiple: true });
