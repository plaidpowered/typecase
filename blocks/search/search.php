<?php

namespace Typecase\Search;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function register_block()
{
    register_block_type(
        'typecase/search', array(
        'editor_script' => WP_DEBUG ? 'typecase-search-block' : 'typecase-blocks',
        'editor_style' => WP_DEBUG ? 'typecase-search-editor' : 'typecase-editor',
    ));

}
add_action('init', 'Typecase\Search\register_block');
