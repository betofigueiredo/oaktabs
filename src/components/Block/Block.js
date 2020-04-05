import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

// Components
import Column from '../Column';
import BlockEnd from './BlockEnd';

function Block({ part_id, block }) {
	const id = (block || {}).id || '';
	const block_id = Number(id.replace(`${part_id}-`, ''));
	const columns = useSelector(store => store.tab.columns, shallowEqual);
	const all_ids = columns.all_ids || [];
	const columns_list = all_ids
		.filter(b => b.indexOf(`${part_id}-${block_id}-`) !== -1);

	return (
		<>
			{columns_list.map(c => (
				<Column
					key={c}
					data-test="columns-render"
					part_id={part_id}
					block_id={block_id}
					column={columns.by_id[c]}
				/>
			))}
			<BlockEnd
				part_id={part_id}
				block_id={block_id}
				data-test="block-render"
			/>
		</>
	);
}

Block.propTypes = {
	part_id: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]).isRequired,
	block: PropTypes.shape({
		id: PropTypes.string,
	}).isRequired,
};

export default Block;
