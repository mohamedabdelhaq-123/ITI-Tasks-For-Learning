@if ($paginator->hasPages())
    <nav style="
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 24px;
        flex-wrap: wrap;
    ">

        {{-- Previous --}}
        @if ($paginator->onFirstPage())
            <span style="padding:6px 12px; color:#aaa; border:1px solid #ddd; border-radius:4px;">
                &laquo; Prev
            </span>
        @else
            <a href="{{ $paginator->previousPageUrl() }}"
               style="padding:6px 12px; border:1px solid #ddd; border-radius:4px; text-decoration:none; color:#333;">
                &laquo; Prev
            </a>
        @endif

        {{-- Page Numbers --}}
        @foreach ($elements as $element)
            @if (is_string($element))
                <span style="padding:6px 8px; color:#aaa;">{{ $element }}</span>
            @endif

            @if (is_array($element))
                @foreach ($element as $page => $url)
                    @if ($page == $paginator->currentPage())
                        <span style="
                            padding:6px 12px;
                            background:#333;
                            color:#fff;
                            border-radius:4px;
                            font-weight:bold;
                        ">{{ $page }}</span>
                    @else
                        <a href="{{ $url }}" style="
                            padding:6px 12px;
                            border:1px solid #ddd;
                            border-radius:4px;
                            text-decoration:none;
                            color:#333;
                        ">{{ $page }}</a>
                    @endif
                @endforeach
            @endif
        @endforeach

        {{-- Next --}}
        @if ($paginator->hasMorePages())
            <a href="{{ $paginator->nextPageUrl() }}"
               style="padding:6px 12px; border:1px solid #ddd; border-radius:4px; text-decoration:none; color:#333;">
                Next &raquo;
            </a>
        @else
            <span style="padding:6px 12px; color:#aaa; border:1px solid #ddd; border-radius:4px;">
                Next &raquo;
            </span>
        @endif

        {{-- Record count --}}
        <span style="margin-left:12px; color:#888; font-size:13px;">
            {{ $paginator->firstItem() }}–{{ $paginator->lastItem() }}
            of {{ $paginator->total() }}
        </span>

    </nav>
@endif