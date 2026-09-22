// @expect-rule: broccoil-react/no-unsafe-target-blank
import React from 'react';

export const UnsafeExpressionLink = () => (
	<a href={'https://example.com'} target={'_blank'}>
		External link
	</a>
);
