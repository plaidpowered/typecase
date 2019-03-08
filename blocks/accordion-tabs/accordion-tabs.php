<?php

namespace Typecase\AccordionTabs;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function register_block()
{
    register_block_type(
        'typecase/accordion-tabs', array(
        'editor_script' => WP_DEBUG ? 'typecase-accordion-tabs-block' : 'typecase-blocks',
        'editor_style' => WP_DEBUG ? 'typecase-accordion-tabs-editor' : 'typecase-editor',
    ));
}
add_action('init', 'Typecase\AccordionTabs\register_block');
