<?php

namespace Typecase\Container;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function register_block()
{
    register_block_type(
        'typecase/container', array(
        'editor_script' => WP_DEBUG ? 'typecase-container-block' : 'typecase-blocks',
        'editor_style' => WP_DEBUG ? 'typecase-container-editor' : 'typecase-editor',
    ));
}
add_action('init', 'Typecase\Container\register_block');
