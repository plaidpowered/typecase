<?php

namespace Typecase\CTA;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function register_block()
{
    register_block_type(
        'typecase/cta', array(
        'editor_script' => WP_DEBUG ? 'typecase-cta-block' : 'typecase-blocks',
        'editor_style' => WP_DEBUG ? 'typecase-cta-editor' : 'typecase-editor',
    ));

}
add_action('init', 'Typecase\CTA\register_block');
