<?php

namespace Typecase\Slider\Slide;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function register_block()
{
    register_block_type(
        'typecase/slider-slide', array(
        'editor_script' => WP_DEBUG ? 'typecase-slider-slide-block' : 'typecase-blocks',
        'editor_style' => WP_DEBUG ? 'typecase-slider-slide-editor' : 'typecase-editor',
    ));

}
add_action('init', 'Typecase\Slider\Slide\register_block');
