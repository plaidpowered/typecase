<?php

namespace Typecase\Slider;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function register_block()
{
    register_block_type(
        'typecase/slider', array(
        'editor_script' => WP_DEBUG ? 'typecase-slider-block' : 'typecase-blocks',
        'editor_style' => WP_DEBUG ? 'typecase-slider-editor' : 'typecase-editor',
    ));
}
add_action('init', 'Typecase\Slider\register_block');
