// @expect-pass: broccoil-react/no-unsafe-target-blank
// v1.0.4: allowReferrer: true 적용 (noopener만 있어도 통과)
import React from 'react';

export const SafeExternalLink = () => {
	return (
		// ✅ rel="noopener"만 있어도 통과 (v1.0.4)
		<a href="https://example.com" target="_blank" rel="noopener">
			External link
		</a>
	);
};
