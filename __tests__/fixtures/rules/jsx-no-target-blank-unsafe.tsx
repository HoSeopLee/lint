// @expect-rule: broccoil-react/no-unsafe-target-blank
import React from 'react';

export const UnsafeExternalLink = () => (
	<a href="https://example.com" target="_blank">
		External link
	</a>
);
