<?php

namespace Typecase\AccordionTabs\Content;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function register_block()
{
    register_block_type(
        'typecase/accordion-tabs-content', array(
        'editor_script' => WP_DEBUG ? 'typecase-accordion-tabs-content-block' : 'typecase-blocks',
        'editor_style' => WP_DEBUG ? 'typecase-accordion-tabs-content-editor' : 'typecase-editor',
    ));

}
add_action('init', 'Typecase\AccordionTabs\Content\register_block');
